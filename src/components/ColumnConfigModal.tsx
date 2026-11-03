import React, { useState } from 'react';
import { X, Plus, Trash2, Columns, ArrowRight } from 'lucide-react';
import { Column } from '../types/prompt';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  inputColumns: Column[];
  outputColumns: Column[];
  onSave: (inputs: Column[], outputs: Column[]) => void;
  lang: 'ar' | 'en';
}

export const ColumnConfigModal: React.FC<Props> = ({
  isOpen,
  onClose,
  inputColumns,
  outputColumns,
  onSave,
  lang,
}) => {
  const [inputs, setInputs] = useState<Column[]>([...inputColumns]);
  const [outputs, setOutputs] = useState<Column[]>([...outputColumns]);

  if (!isOpen) return null;

  const isAr = lang === 'ar';

  const handleAddInput = () => {
    const newId = `in_${Date.now()}`;
    setInputs([
      ...inputs,
      {
        id: newId,
        name: isAr ? `مدخل جديد ${inputs.length + 1}` : `Input ${inputs.length + 1}`,
        type: 'text',
      },
    ]);
  };

  const handleAddOutput = () => {
    const newId = `out_${Date.now()}`;
    setOutputs([
      ...outputs,
      {
        id: newId,
        name: isAr ? `مخرج جديد ${outputs.length + 1}` : `Output ${outputs.length + 1}`,
        type: 'text',
      },
    ]);
  };

  const handleRemoveInput = (id: string) => {
    if (inputs.length <= 1) return;
    setInputs(inputs.filter((c) => c.id !== id));
  };

  const handleRemoveOutput = (id: string) => {
    if (outputs.length <= 1) return;
    setOutputs(outputs.filter((c) => c.id !== id));
  };

  const handleSave = () => {
    onSave(inputs, outputs);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden text-slate-100"
        dir={isAr ? 'rtl' : 'ltr'}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
              <Columns className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                {isAr ? 'تخصيص أعمدة المدخلات والمخرجات' : 'Configure Input & Output Columns'}
              </h2>
              <p className="text-xs text-slate-400">
                {isAr
                  ? 'أضف أو أعد تسمية الأعمدة لتشكيل هيكل المطالبة كما في AI Studio'
                  : 'Add, rename, or delete columns to shape your prompt table structure'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Input Columns */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-400 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                {isAr ? 'أعمدة المدخلات (Inputs)' : 'Input Columns'}
              </span>
              <button
                onClick={handleAddInput}
                className="flex items-center gap-1.5 px-2.5 py-1 text-xs bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 rounded-lg border border-blue-500/30 transition"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{isAr ? 'إضافة مدخل' : 'Add Input'}</span>
              </button>
            </div>

            <div className="space-y-2">
              {inputs.map((col) => (
                <div
                  key={col.id}
                  className="flex items-center gap-2 p-2 bg-slate-800/60 rounded-xl border border-slate-700/60"
                >
                  <input
                    type="text"
                    value={col.name}
                    onChange={(e) =>
                      setInputs(
                        inputs.map((c) => (c.id === col.id ? { ...c, name: e.target.value } : c))
                      )
                    }
                    placeholder={isAr ? 'اسم العمود' : 'Column Name'}
                    className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                  <select
                    value={col.type || 'text'}
                    onChange={(e) =>
                      setInputs(
                        inputs.map((c) =>
                          c.id === col.id ? { ...c, type: e.target.value as any } : c
                        )
                      )
                    }
                    className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-blue-500"
                  >
                    <option value="text">Text (نص)</option>
                    <option value="number">Number (رقم)</option>
                    <option value="json">JSON</option>
                  </select>
                  <button
                    onClick={() => handleRemoveInput(col.id)}
                    disabled={inputs.length <= 1}
                    className="p-1.5 text-slate-400 hover:text-red-400 disabled:opacity-30 disabled:hover:text-slate-400 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Output Columns */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                {isAr ? 'أعمدة المخرجات (Outputs)' : 'Output Columns'}
              </span>
              <button
                onClick={handleAddOutput}
                className="flex items-center gap-1.5 px-2.5 py-1 text-xs bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 rounded-lg border border-emerald-500/30 transition"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{isAr ? 'إضافة مخرج' : 'Add Output'}</span>
              </button>
            </div>

            <div className="space-y-2">
              {outputs.map((col) => (
                <div
                  key={col.id}
                  className="flex items-center gap-2 p-2 bg-slate-800/60 rounded-xl border border-slate-700/60"
                >
                  <input
                    type="text"
                    value={col.name}
                    onChange={(e) =>
                      setOutputs(
                        outputs.map((c) => (c.id === col.id ? { ...c, name: e.target.value } : c))
                      )
                    }
                    placeholder={isAr ? 'اسم العمود' : 'Column Name'}
                    className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                  <select
                    value={col.type || 'text'}
                    onChange={(e) =>
                      setOutputs(
                        outputs.map((c) =>
                          c.id === col.id ? { ...c, type: e.target.value as any } : c
                        )
                      )
                    }
                    className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="text">Text (نص)</option>
                    <option value="number">Number (رقم)</option>
                    <option value="json">JSON</option>
                  </select>
                  <button
                    onClick={() => handleRemoveOutput(col.id)}
                    disabled={outputs.length <= 1}
                    className="p-1.5 text-slate-400 hover:text-red-400 disabled:opacity-30 disabled:hover:text-slate-400 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="px-6 py-3 border-t border-slate-800 bg-slate-900/90 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs text-slate-400 hover:text-white rounded-lg transition"
          >
            {isAr ? 'إلغاء' : 'Cancel'}
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 text-xs bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl shadow-lg shadow-blue-600/20 transition"
          >
            {isAr ? 'حفظ التعديلات' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};
