export interface Column {
  id: string;
  name: string;
  description?: string;
  type: 'text' | 'json' | 'number' | 'boolean';
}

export interface ExampleRow {
  id: string;
  [colId: string]: string;
}

export interface TestCaseRow {
  id: string;
  status?: 'idle' | 'running' | 'success' | 'error';
  rawOutput?: string;
  latencyMs?: number;
  tokens?: number;
  errorMsg?: string;
  [colId: string]: any;
}

export interface StructuredPromptConfig {
  id: string;
  title: string;
  description: string;
  systemInstruction: string;
  inputColumns: Column[];
  outputColumns: Column[];
  examples: ExampleRow[];
  testCases: TestCaseRow[];
  model: string;
  thinkingLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  jsonMode: boolean;
  responseSchema?: string;
}
