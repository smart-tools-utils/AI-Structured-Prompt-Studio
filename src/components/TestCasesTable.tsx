import React, { useState } from 'react';
import {
  Play,
  RotateCcw,
  Plus,
  Trash2,
  Copy,
  Check,
  CheckCircle2,
  AlertCircle,
  Clock,
  Coins,
  Eye,
  Sparkles,
} from 'lucide-react';
import { Column, TestCaseRow } from '../types/prompt';

interface Props {
  inputColumns: Column[];
  outputColumns: Column[];
  testCases: TestCaseRow[];
  onChangeTestCases: (cases: TestCaseRow[]) => void;
  onRunRow: (rowId: string) => Promise<void>;
  lang: 'ar' | 'en';
}

export const TestCasesTable: React.FC<Props> = ({
  inputColumns,
  outputColumns,
  testCases,
  onChangeTestCases,
  onRunRow,
  lang,
}) => {
  const [copiedCell, setCopiedCell] = useState<string | null>(null);
  const [rawModalContent, setRawModalContent] = useState<string | null>(null);

  const isAr = lang === 'ar';

  const handleAddRow = () => {
    const newRow: TestCaseRow = {
      id: `test_${Date.now()}`,
      status: 'idle',
    };
    inputColumns.forEach((c) => (newRow[c.id] = ''));
    outputColumns.forEach((c) => (newRow[c.id] = ''));
    onChangeTestCases([...testCases, newRow]);
  };

  const handleDeleteRow = (idx: number) => {
    onChangeTestCases(testCases.filter((_, i) => i !== idx));
  };

  const handleClearResults = () => {
    onChangeTestCases(
      testCases.map((tc) => {
        const cleaned: TestCaseRow = {
          ...tc,
          status: 'idle',
          rawOutput: undefined,
          latencyMs: undefined,
          tokens: undefined,
          errorMsg: undefined,
        };
        outputColumns.forEach((c) => {
          cleaned[c.id] = '';
        });
        return cleaned;
      })
    );
  };

  const handleCellChange = (rowId: string, colId: string, value: string) => {
    onChangeTestCases(
      testCases.map((r) => (r.id === rowId ? { ...r, [colId]: value } : r))
    );
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCell(id);
    setTimeout(() => setCopiedCell(null), 1500);
  };

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
      {/* Test Section Header */}
      <div className="flex flex-wrap items-center justify-between px-4 py-3 bg-slate-900/90 border-b border-slate-800 gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-xs border border-emerald-500/20">
            {testCases.length}
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              {isAr ? 'جدول الاختبار وتوليد النتائج (Test & Run Table)' : 'Test Cases & Predictions'}
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                {isAr ? 'تجربة حية' : 'Live Inference'}
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">
              {isAr
                ? 'أدخل بيانات الاختبار الجديدة، ثم اضغط على زر التشغيل لتوليد المخرجات بالذكاء الاصطناعي'
                : 'Enter test inputs and run individual rows or all rows to evaluate Gemini predictions.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {testCases.some((t) => t.status === 'success') && (
            <button
              onClick={handleClearResults}
              className="px-2.5 py-1 text-xs text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
            >
              {isAr ? 'مسح النتائج السابقة' : 'Clear Results'}
            </button>
          )}

          <button
            onClick={handleAddRow}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg shadow-sm transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{isAr ? 'إضافة حالة اختبار' : 'Add Test Row'}</span>
          </button>
        </div>
      </div>

      {/* Main Table view */}
      <div className="overflow-x-auto max-h-[520px]">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-semibold select-none">
              <th className="w-12 px-3 py-2.5 text-center text-[10px] text-slate-500">#</th>
              {/* Input column headers */}
              {inputColumns.map((col) => (
                <th
                  key={col.id}
                  className="px-3 py-2.5 border-l border-slate-800/80 bg-blue-950/20"
                >
                  <span className="text-blue-300 font-bold truncate flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                    {col.name}
                  </span>
                </th>
              ))}

              {/* Output column headers */}
              {outputColumns.map((col) => (
                <th
                  key={col.id}
                  className="px-3 py-2.5 border-l border-slate-800/80 bg-emerald-950/20"
                >
                  <span className="text-emerald-300 font-bold truncate flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    {col.name}
                    <span className="text-[10px] text-emerald-500 font-normal">
                      ({isAr ? 'توليد تلقائي' : 'Model Output'})
                    </span>
                  </span>
                </th>
              ))}

              {/* Run & Action header */}
              <th className="w-32 px-3 py-2.5 text-center border-l border-slate-800/80 text-slate-400">
                {isAr ? 'التشغيل' : 'Run / Status'}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 bg-slate-900/40 font-sans">
            {testCases.length === 0 ? (
              <tr>
                <td
                  colSpan={inputColumns.length + outputColumns.length + 2}
                  className="text-center py-8 text-slate-500"
                >
                  <p>{isAr ? 'لا توجد حالات اختبار.' : 'No test cases added yet.'}</p>
                  <button
                    onClick={handleAddRow}
                    className="mt-2 text-emerald-400 hover:underline text-xs"
                  >
                    {isAr ? '+ اضغط هنا لإضافة صف اختبار جديد' : '+ Click here to add a new test case'}
                  </button>
                </td>
              </tr>
            ) : (
              testCases.map((row, idx) => {
                const isRunning = row.status === 'running';
                const isSuccess = row.status === 'success';
                const isError = row.status === 'error';

                return (
                  <tr
                    key={row.id}
                    className={`transition group ${
                      isRunning
                        ? 'bg-blue-950/30 animate-pulse'
                        : isSuccess
                        ? 'bg-emerald-950/10'
                        : isError
                        ? 'bg-red-950/10'
                        : 'hover:bg-slate-800/40'
                    }`}
                  >
                    <td className="px-3 py-2.5 text-center text-slate-500 font-mono text-[11px] align-top">
                      {idx + 1}
                    </td>

                    {/* Input cells */}
                    {inputColumns.map((col) => (
                      <td
                        key={col.id}
                        className="px-2 py-2 border-l border-slate-800/60 align-top bg-blue-950/5"
                      >
                        <textarea
                          value={row[col.id] || ''}
                          onChange={(e) => handleCellChange(row.id, col.id, e.target.value)}
                          placeholder={`${col.name}...`}
                          rows={2}
                          disabled={isRunning}
                          className="w-full bg-transparent hover:bg-slate-950/40 focus:bg-slate-950 border border-transparent hover:border-slate-800 focus:border-blue-500/60 rounded-md p-1.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none transition resize-y font-sans leading-relaxed"
                        />
                      </td>
                    ))}

                    {/* Output cells (Model generation) */}
                    {outputColumns.map((col) => {
                      const val = row[col.id] || '';
                      const cellKey = `${row.id}_${col.id}`;
                      const isCopied = copiedCell === cellKey;

                      return (
                        <td
                          key={col.id}
                          className="px-2 py-2 border-l border-slate-800/60 align-top bg-emerald-950/5 relative"
                        >
                          {isRunning ? (
                            <div className="flex items-center gap-2 p-2 text-blue-400 text-xs">
                              <RotateCcw className="w-3.5 h-3.5 animate-spin" />
                              <span>{isAr ? 'جارِ التوليد مع Gemini...' : 'Generating output...'}</span>
                            </div>
                          ) : isError ? (
                            <div className="p-2 text-xs text-red-400 bg-red-950/30 rounded border border-red-900/50">
                              {row.errorMsg || (isAr ? 'حدث خطأ أثناء التوليد' : 'Generation failed')}
                            </div>
                          ) : (
                            <div className="relative group/cell">
                              <textarea
                                value={val}
                                onChange={(e) => handleCellChange(row.id, col.id, e.target.value)}
                                placeholder={isAr ? '(سيظهر الناتج هنا عند التشغيل)' : '(Run to generate output)'}
                                rows={val.includes('\n') ? Math.min(6, val.split('\n').length + 1) : 2}
                                className={`w-full bg-slate-950/40 focus:bg-slate-950 border border-slate-800/70 focus:border-emerald-500/60 rounded-md p-1.5 text-xs text-slate-100 placeholder-slate-600 focus:outline-none transition resize-y font-sans leading-relaxed ${
                                  val ? 'font-medium' : 'italic text-slate-500'
                                }`}
                              />
                              {val && (
                                <button
                                  onClick={() => handleCopy(val, cellKey)}
                                  className="absolute top-2 right-2 p-1 bg-slate-800/80 hover:bg-slate-700 text-slate-300 rounded opacity-0 group-hover/cell:opacity-100 transition shadow"
                                  title={isAr ? 'نسخ الناتج' : 'Copy'}
                                >
                                  {isCopied ? (
                                    <Check className="w-3 h-3 text-emerald-400" />
                                  ) : (
                                    <Copy className="w-3 h-3" />
                                  )}
                                </button>
                              )}
                            </div>
                          )}
                        </td>
                      );
                    })}

                    {/* Run & Metrics Action cell */}
                    <td className="px-2 py-2.5 border-l border-slate-800/60 align-top text-center">
                      <div className="flex flex-col items-center justify-center gap-1.5">
                        <button
                          onClick={() => onRunRow(row.id)}
                          disabled={isRunning}
                          className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm transition w-full ${
                            isRunning
                              ? 'bg-slate-800 text-slate-400 cursor-not-allowed'
                              : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/20'
                          }`}
                        >
                          {isRunning ? (
                            <RotateCcw className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Play className="w-3 h-3 fill-current" />
                          )}
                          <span>{isRunning ? (isAr ? 'تشغيل...' : 'Running') : (isAr ? 'تشغيل' : 'Run')}</span>
                        </button>

                        {/* Latency & Token Metrics badges */}
                        {isSuccess && (
                          <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-400">
                            {row.latencyMs !== undefined && (
                              <span
                                className="flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono"
                                title={isAr ? 'زمن الاستجابة' : 'Latency'}
                              >
                                <Clock className="w-2.5 h-2.5 text-blue-400" />
                                {(row.latencyMs / 1000).toFixed(2)}s
                              </span>
                            )}
                            {row.tokens !== undefined && (
                              <span
                                className="flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono"
                                title={isAr ? 'عدد التوكنز' : 'Total Tokens'}
                              >
                                <Coins className="w-2.5 h-2.5 text-amber-400" />
                                {row.tokens}t
                              </span>
                            )}
                          </div>
                        )}

                        <div className="flex items-center justify-center gap-1 mt-0.5">
                          {row.rawOutput && (
                            <button
                              onClick={() => setRawModalContent(row.rawOutput || '')}
                              className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition text-[10px]"
                              title={isAr ? 'عرض الاستجابة الخام' : 'View raw API response'}
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteRow(idx)}
                            className="p-1 text-slate-400 hover:text-red-400 rounded hover:bg-slate-800 transition"
                            title={isAr ? 'حذف هذا الصف' : 'Delete test row'}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Raw Output Inspect Modal */}
      {rawModalContent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-5 text-slate-100 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h4 className="font-bold text-sm flex items-center gap-2">
                <Eye className="w-4 h-4 text-blue-400" />
                {isAr ? 'الاستجابة الخام من Gemini API' : 'Raw Model Response'}
              </h4>
              <button
                onClick={() => setRawModalContent(null)}
                className="text-slate-400 hover:text-white text-xs px-2 py-1 rounded hover:bg-slate-800"
              >
                ✕
              </button>
            </div>
            <pre className="p-3 bg-slate-950 rounded-xl text-xs font-mono text-emerald-400 overflow-x-auto max-h-[60vh] select-text">
              {rawModalContent}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
