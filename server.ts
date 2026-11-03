import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, ThinkingLevel } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize GoogleGenAI server-side client with mandatory User-Agent header
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

interface ColumnDef {
  id: string;
  name: string;
  description?: string;
  type?: 'text' | 'json' | 'number' | 'boolean';
}

interface StructuredPromptPayload {
  model?: string;
  systemInstruction?: string;
  inputColumns: ColumnDef[];
  outputColumns: ColumnDef[];
  examples: Array<Record<string, string>>;
  testRow: Record<string, string>;
  thinkingLevel?: 'LOW' | 'MEDIUM' | 'HIGH';
  jsonMode?: boolean;
  responseSchema?: any;
}

// Helper to construct few-shot contents for Gemini
function buildGeminiContents(
  inputColumns: ColumnDef[],
  outputColumns: ColumnDef[],
  examples: Array<Record<string, string>>,
  testRow: Record<string, string>,
  jsonMode: boolean
) {
  const contents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];

  // Helper to format input row
  const formatInputText = (row: Record<string, string>) => {
    return inputColumns
      .map((col) => `### ${col.name}:\n${row[col.id] || '(empty)'}`)
      .join('\n\n');
  };

  // Helper to format output row
  const formatOutputText = (row: Record<string, string>) => {
    if (jsonMode) {
      const obj: Record<string, any> = {};
      outputColumns.forEach((col) => {
        let val = row[col.id] || '';
        if (col.type === 'json' || val.trim().startsWith('{') || val.trim().startsWith('[')) {
          try {
            val = JSON.parse(val);
          } catch {
            // keep string if not valid json
          }
        }
        obj[col.name] = val;
      });
      return JSON.stringify(obj, null, 2);
    }

    if (outputColumns.length === 1) {
      return row[outputColumns[0].id] || '';
    }

    return outputColumns
      .map((col) => `### ${col.name}:\n${row[col.id] || ''}`)
      .join('\n\n');
  };

  // Add few-shot example turns
  examples.forEach((ex) => {
    // Check if example has at least one non-empty field
    const hasInput = inputColumns.some((col) => (ex[col.id] || '').trim().length > 0);
    const hasOutput = outputColumns.some((col) => (ex[col.id] || '').trim().length > 0);
    if (!hasInput && !hasOutput) return;

    contents.push({
      role: 'user',
      parts: [{ text: formatInputText(ex) }],
    });
    contents.push({
      role: 'model',
      parts: [{ text: formatOutputText(ex) }],
    });
  });

  // Add the test case input
  contents.push({
    role: 'user',
    parts: [{ text: formatInputText(testRow) }],
  });

  return contents;
}

// Helper to parse Gemini model response back into output columns
function parseModelOutput(
  rawText: string,
  outputColumns: ColumnDef[],
  jsonMode: boolean
): Record<string, string> {
  const result: Record<string, string> = {};

  if (!rawText) {
    outputColumns.forEach((col) => {
      result[col.id] = '';
    });
    return result;
  }

  // If single column and not JSON mode, take entire text
  if (outputColumns.length === 1 && !jsonMode) {
    result[outputColumns[0].id] = rawText.trim();
    return result;
  }

  // Attempt JSON parse
  let parsedJson: any = null;
  try {
    // Strip markdown code fences if any
    let cleaned = rawText.trim();
    if (cleaned.startsWith('```json')) {
      cleaned = cleaned.replace(/^```json\s*/i, '').replace(/```\s*$/i, '');
    } else if (cleaned.startsWith('```')) {
      cleaned = cleaned.replace(/^```\s*/i, '').replace(/```\s*$/i, '');
    }
    parsedJson = JSON.parse(cleaned);
  } catch {
    parsedJson = null;
  }

  if (parsedJson && typeof parsedJson === 'object') {
    outputColumns.forEach((col) => {
      // Find key matching either column name or column id
      const val = parsedJson[col.name] ?? parsedJson[col.id];
      if (val !== undefined) {
        result[col.id] = typeof val === 'object' ? JSON.stringify(val, null, 2) : String(val);
      } else {
        result[col.id] = '';
      }
    });

    // If matches found, return
    if (Object.values(result).some((v) => v.length > 0)) {
      return result;
    }
  }

  // Fallback: parse sections matching `### Column Name:` or `Column Name:`
  let remaining = rawText;
  outputColumns.forEach((col, idx) => {
    const escapedName = col.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(?:###\\s*)?${escapedName}\\s*:\\s*`, 'i');
    const nextCol = outputColumns[idx + 1];
    let nextRegex: RegExp | null = null;
    if (nextCol) {
      const nextEscaped = nextCol.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      nextRegex = new RegExp(`(?:###\\s*)?${nextEscaped}\\s*:`, 'i');
    }

    const match = remaining.match(regex);
    if (match && match.index !== undefined) {
      const startIdx = match.index + match[0].length;
      let endIdx = remaining.length;
      if (nextRegex) {
        const nextMatch = remaining.slice(startIdx).match(nextRegex);
        if (nextMatch && nextMatch.index !== undefined) {
          endIdx = startIdx + nextMatch.index;
        }
      }
      result[col.id] = remaining.slice(startIdx, endIdx).trim();
    } else if (outputColumns.length === 1) {
      result[col.id] = remaining.trim();
    } else {
      result[col.id] = '';
    }
  });

  // If still empty and only 1 column, assign whole text
  if (outputColumns.length === 1 && !result[outputColumns[0].id]) {
    result[outputColumns[0].id] = rawText.trim();
  }

  return result;
}

// API: Generate single row output
app.post('/api/generate-row', async (req, res) => {
  try {
    const payload: StructuredPromptPayload = req.body;
    const {
      model = 'gemini-3.8-flash',
      systemInstruction = '',
      inputColumns = [],
      outputColumns = [],
      examples = [],
      testRow = {},
      thinkingLevel,
      jsonMode = false,
      responseSchema,
    } = payload;

    if (!inputColumns.length || !outputColumns.length) {
      return res.status(400).json({ error: 'At least one input and one output column are required.' });
    }

    const contents = buildGeminiContents(inputColumns, outputColumns, examples, testRow, jsonMode);

    const config: any = {};
    if (systemInstruction.trim()) {
      config.systemInstruction = systemInstruction.trim();
    }

    if (thinkingLevel) {
      config.thinkingConfig = {
        thinkingLevel:
          thinkingLevel === 'HIGH'
            ? ThinkingLevel.HIGH
            : thinkingLevel === 'LOW'
            ? ThinkingLevel.LOW
            : ThinkingLevel.MEDIUM,
      };
    }

    if (jsonMode) {
      config.responseMimeType = 'application/json';
      if (responseSchema && typeof responseSchema === 'object' && Object.keys(responseSchema).length > 0) {
        config.responseSchema = responseSchema;
      }
    }

    const startTime = Date.now();
    let response: any = null;
    let lastError: any = null;
    const candidateModels = [model, model !== 'gemini-3.1-flash-lite' ? 'gemini-3.1-flash-lite' : 'gemini-3.8-flash'];

    for (const targetModel of candidateModels) {
      for (let attempt = 0; attempt < 2; attempt++) {
        try {
          response = await ai.models.generateContent({
            model: targetModel,
            contents,
            config,
          });
          if (response) break;
        } catch (err: any) {
          lastError = err;
          // Wait briefly before retry if rate limited / 503
          await new Promise((resolve) => setTimeout(resolve, 800 * (attempt + 1)));
        }
      }
      if (response) break;
    }

    if (!response) {
      throw lastError || new Error('Failed to generate response after retries');
    }

    const latencyMs = Date.now() - startTime;
    const rawText = response.text || '';
    const outputs = parseModelOutput(rawText, outputColumns, jsonMode);

    res.json({
      success: true,
      outputs,
      rawText,
      latencyMs,
      usage: response.usageMetadata || null,
    });
  } catch (error: any) {
    console.error('Error generating structured row:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to generate response with Gemini API',
    });
  }
});

// API: Auto-generate sample few-shot examples using Gemini
app.post('/api/suggest-examples', async (req, res) => {
  try {
    const { systemInstruction, inputColumns, outputColumns, topic } = req.body;
    const prompt = `You are an AI prompt engineering expert specializing in Google AI Studio's Structured Prompts.
Given this structured prompt configuration:
System Instruction: "${systemInstruction || 'None'}"
Input Fields: ${JSON.stringify(inputColumns.map((c: any) => c.name))}
Output Fields: ${JSON.stringify(outputColumns.map((c: any) => c.name))}
Topic / Domain hint: "${topic || 'General high-quality few-shot training examples'}"

Generate 3 diverse, high-quality few-shot training examples that demonstrate the ideal task behavior.
Return a valid JSON array of objects, where each object has keys matching the exact input and output column names.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '[]');
    res.json({ success: true, examples: parsed });
  } catch (error: any) {
    console.error('Error suggesting examples:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Setup Vite in Dev mode or serve static files in Production
async function setupServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, () => {
    console.log(`Structured Prompt Studio server running at http://localhost:${port}`);
  });
}

setupServer();
