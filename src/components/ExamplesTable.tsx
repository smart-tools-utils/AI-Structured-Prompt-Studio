import React, { useState } from 'react';
import {
  Table,
  Plus,
  Trash2,
  Copy,
  Sparkles,
  Columns,
  RotateCcw,
  CheckCircle,
  HelpCircle,
} from 'lucide-react';
import { Column, ExampleRow } from '../types/prompt';

interface Props {
  inputColumns: Column[];
  outputColumns: Column[];
  examples: ExampleRow[];
  onChangeExamples: (examples: ExampleRow[]) => void;
  onOpenColumnConfig: () => void;
  systemInstruction: string;
  lang: 'ar' | 'en';
}

export const ExamplesTable: React.FC<Props> = ({
  inputColumns,
  outputColumns,
  examples,
  onChangeExamples,
  onOpenColumnConfig,
  systemInstruction,
  lang,
}) => {
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [suggestError, setSuggestError] = useState<string | null>(null);

  const isAr = lang === 'ar';

  const handleAddRow = () => {
    const newRow: ExampleRow = {
      id: `ex_${Date.now()}`,
    };
    inputColumns.forEach((c) => (newRow[c.id] = ''));
    outputColumns.forEach((c) => (newRow[c.id] = ''));
    onChangeExamples([...examples, newRow]);
  };

  const handleDuplicateRow = (idx: number) => {
    const target = examples[idx];
    const clone: ExampleRow = {
      ...target,
      id: `ex_${Date.now()}_clone`,
    };
    const next = [...examples];
    next.splice(idx + 1, 0, clone);
    onChangeExamples(next);
  };

  const handleDeleteRow = (idx: number) => {
    onChangeExamples(examples.filter((_, i) => i !== idx));
  };

  const handleCellChange = (rowId: string, colId: string, value: string) => {
    onChangeExamples(
      examples.map((r) => (r.id === rowId ? { ...r, [colId]: value } : r))
    );
  };

  const handleSuggestExamples = async () => {
    try {
      setIsSuggesting(true);
      setSuggestError(null);
      const res = await fetch('/api/suggest-examples', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction,
          inputColumns,
          outputColumns,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to suggest examples');
      }

      if (Array.isArray(data.examples)) {
        const mapped = data.examples.map((item: any, i: number) => {
          const row: ExampleRow = { id: `sug_${Date.now()}_${i}` };
          inputColumns.forEach((col) => {
            row[col.id] = item[col.name] || item[col.id] || '';
          });
          outputColumns.forEach((col) => {
            row[col.id] =
              typeof item[col.name] === 'object'
                ? JSON.stringify(item[col.name], null, 2)
                : item[col.name] || item[col.id] || '';
          });
          return row;
        });
        onChangeExamples([...examples, ...mapped]);
      }
    } catch (err: any) {
      setSuggestError(err.message);
    } finally {
      setIsSuggesting(false);
    }
  };

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
      {/* Table Header toolbar */}
      <div className="flex flex-wrap items-center justify-between px-4 py-3 bg-slate-900/90 border-b border-slate-800 gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold text-xs border border-blue-500/20">
            {examples.length}
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              {isAr ? 'أمثلة التدريب (Examples / Few-shot Table)' : 'Examples Table (Few-shot Conditioning)'}
            </h3>
            <p className="text-[11px] text-slate-400">
              {isAr
                ? 'قدم للنموذج 2 إلى 5 أمثلة توضح العلاقة بين المدخلات والمخرجات'
                : 'Supply 2-5 examples to teach the model desired outputs without fine-tuning.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* AI Suggest Examples button */}
          <button
            onClick={handleSuggestExamples}
            disabled={isSuggesting}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-purple-600/20 to-blue-600/20 hover:from-purple-600/30 hover:to-blue-600/30 text-purple-300 text-xs font-medium rounded-lg border border-purple-500/30 transition shadow-sm"
            title={isAr ? 'اقتراح أمثلة تلقائياً عبر Gemini' : 'Auto-generate few-shot examples with Gemini'}
          >
            {isSuggesting ? (
              <RotateCcw className="w-3.5 h-3.5 animate-spin text-purple-400" />
            ) : (
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            )}
            <span>{isSuggesting ? (isAr ? 'جارِ التوليد...' : 'Generating...') : (isAr ? 'توليد أمثلة بالذكاء الاصطناعي' : 'Suggest Examples')}</span>
          </button>

          {/* Add example button */}
          <button
            onClick={handleAddRow}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg shadow-sm transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{isAr ? 'إضافة مثال' : 'Add Example'}</span>
          </button>
        </div>
      </div>

      {suggestError && (
        <div className="px-4 py-2 bg-red-950/40 border-b border-red-800 text-red-300 text-xs">
          {suggestError}
        </div>
      )}

      {/* Main Table view */}
      <div className="overflow-x-auto max-h-[480px]">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-semibold select-none">
              <th className="w-12 px-3 py-2.5 text-center text-[10px] text-slate-500">#</th>
              {/* Input column headers */}
              {inputColumns.map((col) => (
                <th
                  key={col.id}
                  className="px-3 py-2.5 border-l border-slate-800/80 bg-blue-950/15"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-blue-300 font-bold truncate flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                      {col.name}
                    </span>
                    <span className="text-[10px] font-mono px-1 py-0.2 rounded bg-blue-500/10 text-blue-400 uppercase">
                      IN
                    </span>
                  </div>
                </th>
              ))}

              {/* Output column headers */}
              {outputColumns.map((col) => (
                <th
                  key={col.id}
                  className="px-3 py-2.5 border-l border-slate-800/80 bg-emerald-950/15"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-emerald-300 font-bold truncate flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                      {col.name}
                    </span>
                    <span className="text-[10px] font-mono px-1 py-0.2 rounded bg-emerald-500/10 text-emerald-400 uppercase">
                      OUT
                    </span>
                  </div>
                </th>
              ))}

              {/* Action header */}
              <th className="w-20 px-3 py-2.5 text-center border-l border-slate-800/80 text-slate-500">
                {isAr ? 'إجراءات' : 'Actions'}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 bg-slate-900/40 font-sans">
            {examples.length === 0 ? (
              <tr>
                <td
                  colSpan={inputColumns.length + outputColumns.length + 2}
                  className="text-center py-8 text-slate-500"
                >
                  <p>{isAr ? 'لا توجد أمثلة حتى الآن.' : 'No examples added yet.'}</p>
                  <button
                    onClick={handleAddRow}
                    className="mt-2 text-blue-400 hover:underline text-xs"
                  >
                    {isAr ? '+ اضغط هنا لإضافة المثال الأول' : '+ Click here to add your first example'}
                  </button>
                </td>
              </tr>
            ) : (
              examples.map((row, idx) => (
                <tr key={row.id} className="hover:bg-slate-800/40 transition group">
                  <td className="px-3 py-2 text-center text-slate-500 font-mono text-[11px] align-top">
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
                        className="w-full bg-transparent hover:bg-slate-950/40 focus:bg-slate-950 border border-transparent hover:border-slate-800 focus:border-blue-500/60 rounded-md p-1.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none transition resize-y font-sans leading-relaxed"
                      />
                    </td>
                  ))}

                  {/* Output cells */}
                  {outputColumns.map((col) => (
                    <td
                      key={col.id}
                      className="px-2 py-2 border-l border-slate-800/60 align-top bg-emerald-950/5"
                    >
                      <textarea
                        value={row[col.id] || ''}
                        onChange={(e) => handleCellChange(row.id, col.id, e.target.value)}
                        placeholder={`${col.name}...`}
                        rows={2}
                        className="w-full bg-transparent hover:bg-slate-950/40 focus:bg-slate-950 border border-transparent hover:border-slate-800 focus:border-emerald-500/60 rounded-md p-1.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none transition resize-y font-sans leading-relaxed"
                      />
                    </td>
                  ))}

                  {/* Row Actions */}
                  <td className="px-2 py-2 border-l border-slate-800/60 align-top text-center">
                    <div className="flex items-center justify-center gap-1 opacity-70 group-hover:opacity-100 transition">
                      <button
                        onClick={() => handleDuplicateRow(idx)}
                        className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition"
                        title={isAr ? 'نسخ هذا المثال' : 'Duplicate row'}
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteRow(idx)}
                        className="p-1 text-slate-400 hover:text-red-400 rounded hover:bg-slate-800 transition"
                        title={isAr ? 'حذف هذا المثال' : 'Delete row'}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
