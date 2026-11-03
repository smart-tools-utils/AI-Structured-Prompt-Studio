import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Download,
  Plus,
  CheckCircle2,
  FileJson,
  Layers,
  HelpCircle,
  FolderTree,
  ArrowRight,
  RotateCcw,
} from 'lucide-react';
import { TestCaseRow } from '../types/prompt';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onAppendTestCases: (newRows: TestCaseRow[]) => void;
  lang: 'ar' | 'en';
}

export const BatchGeneratorModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onAppendTestCases,
  lang,
}) => {
  const [targetApp, setTargetApp] = useState<'taxikorkort' | 'CivicQuiz' | 'custom'>('taxikorkort');
  const [count, setCount] = useState<number>(50);
  const [topic, setTopic] = useState('قوانين التاكسي في السويد (Transportstyrelsens TFL)');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState<any[] | null>(null);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!isOpen) return null;

  const isAr = lang === 'ar';

  const handleGenerate = async () => {
    setIsGenerating(true);
    setGeneratedQuestions(null);
    setDownloadSuccess(false);

    try {
      const res = await fetch('/api/generate-batch-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          count,
          targetApp,
        }),
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.questions)) {
        setGeneratedQuestions(data.questions);
      }
    } catch (err) {
      console.error('Batch generation failed:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadJson = () => {
    if (!generatedQuestions) return;
    const jsonStr = JSON.stringify(generatedQuestions, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = targetApp === 'CivicQuiz' ? 'civic_quiz_questions.json' : 'taxikorkort_questions.json';
    a.click();
    URL.revokeObjectURL(url);
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  const handleAddToStudioTable = () => {
    if (!generatedQuestions) return;
    const rows: TestCaseRow[] = generatedQuestions.map((q, idx) => ({
      id: `batch_${Date.now()}_${idx}`,
      in_topic: q.question_sv,
      out_quiz_json: JSON.stringify(q, null, 2),
      status: 'success',
      latencyMs: 150,
    }));
    onAppendTestCases(rows);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="relative w-full max-w-4xl max-h-[90vh] flex flex-col bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden text-slate-100"
        dir={isAr ? 'rtl' : 'ltr'}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500/20 to-blue-500/20 text-amber-300 flex items-center justify-center border border-amber-500/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                {isAr ? 'توليد دفعة أسئلة مجمعة (حتى 50 سؤالاً)' : 'Bulk Questions Generator (up to 50)'}
                <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  taxikorkort & CivicQuiz
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                {isAr
                  ? 'توليد فوري لـ 50 سؤالاً أو تصديرها كملف JSON جاهز للاستخدام المباشر في تطبيقاتك'
                  : 'Batch generate 50 questions and export as ready-to-use JSON file'}
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

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs">
          {/* Controls: Target App & Quantity */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Target App */}
            <div className="space-y-1.5">
              <label className="text-slate-300 font-semibold flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-blue-400" />
                {isAr ? 'التطبيق المستهدف:' : 'Target Application:'}
              </label>
              <select
                value={targetApp}
                onChange={(e) => {
                  const val = e.target.value as any;
                  setTargetApp(val);
                  if (val === 'taxikorkort') {
                    setTopic('قوانين التاكسي في السويد (Transportstyrelsens TFL)');
                  } else if (val === 'CivicQuiz') {
                    setTopic('المعرفة المدنية والجنسية السويدية (Samhällsorganisation & Demokrati)');
                  }
                }}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-blue-500 cursor-pointer"
              >
                <option value="taxikorkort">🚖 تطبيق أسئلة التاكسي (taxikorkort)</option>
                <option value="CivicQuiz">🇸🇪 تطبيق الجنسية والمعرفة المدنية (CivicQuiz)</option>
                <option value="custom">✨ موضوع مخصص آخر (Custom Topic)</option>
              </select>
            </div>

            {/* Question Count */}
            <div className="space-y-1.5">
              <label className="text-slate-300 font-semibold flex items-center gap-1.5">
                <FileJson className="w-4 h-4 text-amber-400" />
                {isAr ? 'عدد الأسئلة المطلوبة:' : 'Number of Questions:'}
              </label>
              <div className="flex items-center gap-1.5">
                {[10, 25, 50].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setCount(num)}
                    className={`flex-1 py-2 rounded-xl font-bold border transition ${
                      count === num
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/60 shadow-sm'
                        : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    {num} {isAr ? 'سؤال' : 'Q'}
                  </button>
                ))}
              </div>
            </div>

            {/* Generate Trigger Button */}
            <div className="space-y-1.5 flex flex-col justify-end">
              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-blue-600/30 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isGenerating ? (
                  <>
                    <RotateCcw className="w-4 h-4 animate-spin" />
                    <span>{isAr ? 'جارِ إنشاء الأسئلة...' : 'Generating...'}</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>{isAr ? `توليد ${count} سؤالاً الآن` : `Generate ${count} Questions`}</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Topic Input if custom */}
          <div className="space-y-1.5">
            <label className="text-slate-300 font-semibold">
              {isAr ? 'تفاصيل الموضوع ومجالات التركيز:' : 'Topic Details & Focus Areas:'}
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder={isAr ? 'مثال: أسئلة عن أوقات الراحة، عداد التاكسي، أو القوانين الأساسية...' : 'Topic focus...'}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Results preview & Action buttons */}
          {generatedQuestions && (
            <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/40 space-y-3 animate-in fade-in duration-200">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>
                    {isAr
                      ? `تم بنجاح تجهيز ${generatedQuestions.length} سؤالاً بصيغة JSON مهيكلة!`
                      : `Successfully generated ${generatedQuestions.length} structured questions!`}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleDownloadJson}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg shadow transition"
                  >
                    <Download className="w-4 h-4" />
                    <span>{downloadSuccess ? (isAr ? 'تم التحميل!' : 'Downloaded!') : (isAr ? 'تحميل ملف questions.json' : 'Download questions.json')}</span>
                  </button>

                  <button
                    onClick={handleAddToStudioTable}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-lg border border-slate-700 transition"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{isAr ? 'إدراج في جدول الاستوديو' : 'Add to Studio Table'}</span>
                  </button>
                </div>
              </div>

              {/* Sample preview box */}
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 font-mono text-[11px] text-slate-300 max-h-48 overflow-y-auto">
                <pre>{JSON.stringify(generatedQuestions.slice(0, 2), null, 2)}</pre>
                <div className="text-center text-slate-500 text-[10px] mt-2">
                  ... ({generatedQuestions.length - 2} {isAr ? 'أسئلة إضافية في الملف الكامل' : 'more questions in the file'})
                </div>
              </div>
            </div>
          )}

          {/* Guide on how to use in taxikorkort and CivicQuiz */}
          <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60 space-y-3">
            <h4 className="font-bold text-white text-xs flex items-center gap-2">
              <FolderTree className="w-4 h-4 text-blue-400" />
              {isAr
                ? 'كيف تضيف هذا الملف إلى تطبيقي "taxikorkort" و "CivicQuiz"؟'
                : 'How to add this JSON file into "taxikorkort" and "CivicQuiz"?'}
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px] text-slate-300">
              <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 space-y-1.5">
                <div className="font-bold text-amber-300 flex items-center gap-1.5">
                  <span>1. في تطبيق taxikorkort:</span>
                </div>
                <p className="leading-relaxed">
                  {isAr
                    ? 'في مشروع taxikorkort، ستجد عادة ملف الأسئلة داخل مسار: `src/data/questions.json` أو `src/data/questions.ts`. استبدل محتواه بالمصفوفة التي تم تحميلها، أو أضف زراً في التطبيق لقراءة الملف.'
                    : 'Inside the taxikorkort project, questions reside in `src/data/questions.json`. Replace its contents with this generated JSON array.'}
                </p>
              </div>

              <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 space-y-1.5">
                <div className="font-bold text-blue-300 flex items-center gap-1.5">
                  <span>2. في تطبيق CivicQuiz:</span>
                </div>
                <p className="leading-relaxed">
                  {isAr
                    ? 'في تطبيق CivicQuiz، يتم تخزين الأسئلة أيضاً بنفس الهيكل (question_sv, question_ar, options, correct_index). كل ما تحتاجه هو حفظ الملف كـ `civic_questions.json` ووضعه في مجلد البيانات `src/data/`.'
                    : 'In CivicQuiz, questions share the same schema. Save the file to `src/data/` in that project.'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-900/90 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            {isAr ? 'صيغة قياسية متوافقة 100% مع تطبيقات الامتحانات' : 'Standard JSON format compatible with quiz apps'}
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition"
          >
            {isAr ? 'إغلاق' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
