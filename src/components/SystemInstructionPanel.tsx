import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Sparkles, MessageSquareCode, Info } from 'lucide-react';

interface Props {
  systemInstruction: string;
  onChange: (val: string) => void;
  lang: 'ar' | 'en';
}

export const SystemInstructionPanel: React.FC<Props> = ({
  systemInstruction,
  onChange,
  lang,
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const isAr = lang === 'ar';

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden transition">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 bg-slate-900/90 hover:bg-slate-800/60 text-left transition"
      >
        <div className="flex items-center gap-2.5">
          <MessageSquareCode className="w-4 h-4 text-blue-400" />
          <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">
            {isAr ? 'تعليمات النظام (System Instructions)' : 'System Instructions'}
          </span>
          <span className="text-[11px] text-slate-500 font-normal">
            ({isAr ? 'اختياري لكن يُنصح به لضبط سلوك النموذج' : 'Optional guidance for the model'})
          </span>
        </div>
        <div className="flex items-center gap-2 text-slate-400">
          {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </div>
      </button>

      {isOpen && (
        <div className="p-4 border-t border-slate-800/80 space-y-2">
          <textarea
            value={systemInstruction}
            onChange={(e) => onChange(e.target.value)}
            rows={3}
            placeholder={
              isAr
                ? 'حدد دور النموذج ونبرته والقواعد الصارمة التي يجب أن يلتزم بها (مثال: أنت خبير استخراج بيانات، أجب بدقة بدون إضافة ثرثرة)...'
                : 'Give the model contextual instructions, role definition, formatting constraints, or tone guidance...'
            }
            className="w-full bg-slate-950/80 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500/80 focus:ring-1 focus:ring-blue-500/30 transition resize-y font-sans leading-relaxed"
          />
          <div className="flex items-center justify-between text-[11px] text-slate-500 px-1">
            <span className="flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-blue-400/80" />
              {isAr
                ? 'في Structured Prompt، تعمل تعليمات النظام كإطار مرجعي يدعم أمثلة Few-shot'
                : 'System instructions set the persistent baseline before few-shot examples are evaluated.'}
            </span>
            <span>{systemInstruction.length} {isAr ? 'حرف' : 'chars'}</span>
          </div>
        </div>
      )}
    </div>
  );
};
