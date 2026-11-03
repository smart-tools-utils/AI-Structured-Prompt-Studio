import React from 'react';
import {
  X,
  BookOpen,
  CheckCircle2,
  TableProperties,
  ArrowRight,
  ExternalLink,
  Sparkles,
  Layers,
  Code2,
  HelpCircle,
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  lang: 'ar' | 'en';
}

export const AIStudioGuideModal: React.FC<Props> = ({ isOpen, onClose, lang }) => {
  if (!isOpen) return null;

  const isAr = lang === 'ar';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-4xl max-h-[90vh] flex flex-col bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden text-slate-100"
        dir={isAr ? 'rtl' : 'ltr'}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90 sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
              <TableProperties className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                {isAr
                  ? 'دليل خاصية Structured Prompt في Google AI Studio'
                  : 'Google AI Studio Structured Prompt Guide'}
                <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/40">
                  {isAr ? 'شرح شامل' : 'Complete Guide'}
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                {isAr
                  ? 'ما هي الخاصية، كيف تصل إليها في موقع AI Studio الرسمي، وكيف تستفيد منها في مشاريعك'
                  : 'What it is, how to open it in AI Studio, and how to harness it for production'}
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

        {/* Content body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-sm leading-relaxed">
          {/* Quick Answer Banner */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-blue-900/40 via-indigo-900/30 to-purple-900/40 border border-blue-500/30">
            <h3 className="text-base font-semibold text-blue-300 flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              {isAr ? 'ماذا تفعل للحصول عليها؟' : 'How to get started right away?'}
            </h3>
            <p className="text-slate-200 leading-relaxed mb-3">
              {isAr
                ? 'خاصية Structured Prompt (المطالبة المهيكلة) هي إحدى أوضاع العمل الرئيسية الثلاثة في Google AI Studio، صُممت خصيصاً لتقنية Few-shot Prompting (التلقين بالأمثلة). بدلاً من الشرح المطوّل، تضع أعمدة للمدخلات والمخرجات وتزود النموذج بعدة أمثلة في جدول منظم!'
                : 'The Structured Prompt is one of the three core prompt types in Google AI Studio, specifically designed for Few-Shot Prompting. Instead of long textual instructions, you define input/output columns and give the model tabular examples!'}
            </p>
            <div className="flex flex-wrap gap-2 text-xs">
              <a
                href="https://aistudio.google.com"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg transition"
              >
                <span>{isAr ? 'فتح موقع Google AI Studio الرسمي' : 'Open Google AI Studio'}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <button
                onClick={onClose}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium rounded-lg border border-slate-700 transition"
              >
                <span>{isAr ? 'تجربتها مباشرة في هذه الواجهة الآن' : 'Use this live clone right here'}</span>
              </button>
            </div>
          </div>

          {/* Steps in Google AI Studio */}
          <div className="space-y-3">
            <h4 className="text-base font-bold text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-emerald-400" />
              {isAr
                ? 'خطوات إنشاء Structured Prompt في موقع Google AI Studio الرسمي:'
                : 'Steps to create a Structured Prompt in official Google AI Studio:'}
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-2">
                <div className="w-7 h-7 rounded-full bg-blue-500/20 text-blue-400 font-bold flex items-center justify-center text-xs border border-blue-500/40">
                  1
                </div>
                <h5 className="font-semibold text-white">
                  {isAr ? 'تسجيل الدخول والنقر على Create' : 'Sign In & Click Create'}
                </h5>
                <p className="text-xs text-slate-400">
                  {isAr
                    ? 'اذهب إلى aistudio.google.com، واضغط على زر "+ Create new prompt" الأزرق في الزاوية العلوية.'
                    : 'Go to aistudio.google.com and click "+ Create new prompt" button.'}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-2">
                <div className="w-7 h-7 rounded-full bg-indigo-500/20 text-indigo-400 font-bold flex items-center justify-center text-xs border border-indigo-500/40">
                  2
                </div>
                <h5 className="font-semibold text-white">
                  {isAr ? 'اختيار Structured prompt' : 'Select "Structured prompt"'}
                </h5>
                <p className="text-xs text-slate-400">
                  {isAr
                    ? 'من النافذة المنبثقة، اختر "Structured prompt" بدلاً من "Chat prompt" أو "Freeform prompt".'
                    : 'From the prompt selector, pick "Structured prompt" instead of Chat or Freeform.'}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-2">
                <div className="w-7 h-7 rounded-full bg-purple-500/20 text-purple-400 font-bold flex items-center justify-center text-xs border border-purple-500/40">
                  3
                </div>
                <h5 className="font-semibold text-white">
                  {isAr ? 'تحديد الحقول والأمثلة' : 'Define Fields & Examples'}
                </h5>
                <p className="text-xs text-slate-400">
                  {isAr
                    ? 'حدد أعمدة المدخلات والمخرجات، أضف 2-5 أمثلة توضيحية، ثم اختبر النتيجة في جدول الاختبار Test.'
                    : 'Add your input & output columns, supply 2-5 few-shot examples, and run test rows.'}
                </p>
              </div>
            </div>
          </div>

          {/* Comparison table */}
          <div className="space-y-3">
            <h4 className="text-base font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              {isAr
                ? 'مقارنة بين أنواع المطالبات في AI Studio:'
                : 'Comparison of Prompt Types in AI Studio:'}
            </h4>

            <div className="overflow-x-auto rounded-xl border border-slate-800">
              <table className="w-full text-xs text-right">
                <thead className="bg-slate-800 text-slate-300 font-semibold border-b border-slate-700">
                  <tr>
                    <th className="p-3">{isAr ? 'نوع المطالبة' : 'Prompt Type'}</th>
                    <th className="p-3">{isAr ? 'متى تستخدمها؟' : 'Best Used For'}</th>
                    <th className="p-3">{isAr ? 'طريقة البناء' : 'Structure'}</th>
                    <th className="p-3">{isAr ? 'الميزة الأبرز' : 'Key Advantage'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  <tr className="bg-blue-950/20 border-l-2 border-l-blue-500">
                    <td className="p-3 font-semibold text-blue-400 flex items-center gap-1.5">
                      <TableProperties className="w-4 h-4" />
                      Structured Prompt
                    </td>
                    <td className="p-3">
                      {isAr
                        ? 'المهام المتكررة، التصنيف، استخراج البيانات، الترجمة المنضبطة، صياغة النصوص بنمط موحد.'
                        : 'Repetitive tasks, classification, data extraction, consistent tone generation.'}
                    </td>
                    <td className="p-3">
                      {isAr ? 'جدول أعمدة (مدخلات ومخرجات) مع أمثلة Few-shot' : 'Table of input/output columns with examples'}
                    </td>
                    <td className="p-3 text-emerald-400 font-medium">
                      {isAr ? 'دقة وتناسق لا مثيل لهما بدون تدريب مسبق' : 'Zero hallucination & strict structure'}
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-300">Freeform Prompt</td>
                    <td className="p-3">
                      {isAr ? 'المقالات، تلخيص الأوراق الطويلة، البرمجة الإبداعية' : 'Long-form text, essays, document summary'}
                    </td>
                    <td className="p-3">{isAr ? 'نص حر ومستمر' : 'Single continuous prompt buffer'}</td>
                    <td className="p-3">{isAr ? 'حرية تعبير مطلقة' : 'Maximum open-ended flexibility'}</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-300">Chat Prompt</td>
                    <td className="p-3">
                      {isAr ? 'المساعد الشخصي، روبوتات الدعم، الاستشارات التفاعلية' : 'Conversational agents, chatbots, roleplay'}
                    </td>
                    <td className="p-3">{isAr ? 'رسائل متبادلة (مستخدم / نموذج)' : 'Multi-turn back-and-forth messages'}</td>
                    <td className="p-3">{isAr ? 'حفظ سياق الحوار المستمر' : 'Contextual memory across turns'}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Key Features in our live studio */}
          <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60 space-y-3">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              {isAr ? 'الميزات المتوفرة لك في هذه البيئة الحية:' : 'Features in this Live Environment:'}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-slate-300">
              <div className="flex items-start gap-2">
                <span className="text-blue-400 font-bold">•</span>
                <span>
                  {isAr
                    ? 'ربط مباشر وسيرفر حقيقي مع نماذج Gemini الرسمية (gemini-3.8-flash و gemini-3.1-flash-lite).'
                    : 'Real live backend connection to Gemini models (gemini-3.8-flash, etc.).'}
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-blue-400 font-bold">•</span>
                <span>
                  {isAr
                    ? 'إمكانية إضافة وحذف وتعديل أعمدة المدخلات والمخرجات بأنواعها (نص، JSON، أرقام).'
                    : 'Add, remove, and configure unlimited input and output columns.'}
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-blue-400 font-bold">•</span>
                <span>
                  {isAr
                    ? 'توليد ذكي للأمثلة التدريبية تلقائياً بنقرة زر عبر Gemini.'
                    : 'AI-assisted generation of realistic few-shot training examples.'}
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-blue-400 font-bold">•</span>
                <span>
                  {isAr
                    ? 'تصدير الكود البرمجي الكامل (Python SDK و TypeScript SDK و cURL) بأسلوب Get Code.'
                    : 'Export production code in Python, TypeScript SDK, and cURL.'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-900/90 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            {isAr ? 'مدعوم بمكتبة @google/genai الرسمية' : 'Powered by official @google/genai SDK'}
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs rounded-xl shadow-lg shadow-blue-600/20 transition"
          >
            {isAr ? 'بدء العمل واستخدام الواجهة' : 'Start Using the Studio'}
          </button>
        </div>
      </div>
    </div>
  );
};
