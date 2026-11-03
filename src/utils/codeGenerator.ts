import { StructuredPromptConfig } from '../types/prompt';

export function generatePythonCode(config: StructuredPromptConfig): string {
  const { systemInstruction, inputColumns, outputColumns, examples, testCases, model } = config;
  const sampleTest = testCases[0] || {};

  return `import os
from google import genai
from google.genai import types

# Initialize client with GEMINI_API_KEY environment variable
client = genai.Client(
    http_options={'headers': {'User-Agent': 'aistudio-build'}}
)

# Structured Prompt Few-Shot contents
contents = [
${examples
  .map(
    (ex) => `    # Example
    types.Content(
        role="user",
        parts=[types.Part.from_text("""${inputColumns
          .map((c) => `### ${c.name}:\\n${(ex[c.id] || '').replace(/"/g, '\\"')}`)
          .join('\\n\\n')}""")]
    ),
    types.Content(
        role="model",
        parts=[types.Part.from_text("""${outputColumns
          .map((c) => `### ${c.name}:\\n${(ex[c.id] || '').replace(/"/g, '\\"')}`)
          .join('\\n\\n')}""")]
    ),`
  )
  .join('\n')}
    # Test input
    types.Content(
        role="user",
        parts=[types.Part.from_text("""${inputColumns
          .map((c) => `### ${c.name}:\\n${(sampleTest[c.id] || '').replace(/"/g, '\\"')}`)
          .join('\\n\\n')}""")]
    )
]

config = types.GenerateContentConfig(
    ${systemInstruction.trim() ? `system_instruction="""${systemInstruction.replace(/"/g, '\\"')}""",` : ''}
    ${config.jsonMode ? `response_mime_type="application/json",` : ''}
)

response = client.models.generate_content(
    model="${model || 'gemini-3.8-flash'}",
    contents=contents,
    config=config
)

print(response.text)
`;
}

export function generateTypeScriptCode(config: StructuredPromptConfig): string {
  const { systemInstruction, inputColumns, outputColumns, examples, testCases, model } = config;
  const sampleTest = testCases[0] || {};

  return `import { GoogleGenAI } from "@google/genai";

// Initialize client on the server side
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

async function runStructuredPrompt() {
  const contents = [
${examples
  .map(
    (ex) => `    // Example turn
    {
      role: 'user',
      parts: [{
        text: \`${inputColumns
          .map((c) => `### ${c.name}:\\n${(ex[c.id] || '').replace(/`/g, '\\`').replace(/\$/g, '\\$')}`)
          .join('\\n\\n')}\`
      }]
    },
    {
      role: 'model',
      parts: [{
        text: \`${outputColumns
          .map((c) => `### ${c.name}:\\n${(ex[c.id] || '').replace(/`/g, '\\`').replace(/\$/g, '\\$')}`)
          .join('\\n\\n')}\`
      }]
    },`
  )
  .join('\n')}
    // Test case
    {
      role: 'user',
      parts: [{
        text: \`${inputColumns
          .map((c) => `### ${c.name}:\\n${(sampleTest[c.id] || '').replace(/`/g, '\\`').replace(/\$/g, '\\$')}`)
          .join('\\n\\n')}\`
      }]
    }
  ];

  const response = await ai.models.generateContent({
    model: "${model || 'gemini-3.8-flash'}",
    contents,
    config: {
      ${systemInstruction.trim() ? `systemInstruction: \`${systemInstruction.replace(/`/g, '\\`')}\`,` : ''}
      ${config.jsonMode ? `responseMimeType: "application/json",` : ''}
    }
  });

  console.log(response.text);
}

runStructuredPrompt();
`;
}

export function generateCurlCode(config: StructuredPromptConfig): string {
  const { systemInstruction, inputColumns, outputColumns, examples, testCases, model } = config;
  const sampleTest = testCases[0] || {};

  const contents = [
    ...examples.flatMap((ex) => [
      {
        role: 'user',
        parts: [{ text: inputColumns.map((c) => `### ${c.name}:\n${ex[c.id] || ''}`).join('\n\n') }],
      },
      {
        role: 'model',
        parts: [{ text: outputColumns.map((c) => `### ${c.name}:\n${ex[c.id] || ''}`).join('\n\n') }],
      },
    ]),
    {
      role: 'user',
      parts: [{ text: inputColumns.map((c) => `### ${c.name}:\n${sampleTest[c.id] || ''}`).join('\n\n') }],
    },
  ];

  const payload = {
    contents,
    ...(systemInstruction.trim()
      ? { systemInstruction: { parts: [{ text: systemInstruction.trim() }] } }
      : {}),
    ...(config.jsonMode ? { generationConfig: { responseMimeType: 'application/json' } } : {}),
  };

  return `curl "https://generativelanguage.googleapis.com/v1beta/models/${model || 'gemini-3.8-flash'}:generateContent?key=\${GEMINI_API_KEY}" \\
  -H 'Content-Type: application/json' \\
  -X POST \\
  -d '${JSON.stringify(payload, null, 2).replace(/'/g, "'\\''")}'
`;
}
