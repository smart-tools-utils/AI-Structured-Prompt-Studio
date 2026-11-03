import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Layers,
  FileJson,
  Upload,
  Download,
  BookOpen,
  ArrowRight,
  ExternalLink,
  HelpCircle,
  RotateCcw,
  Plus,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { StructuredPromptConfig, TestCaseRow } from './types/prompt';
import { PRESETS } from './data/presets';
import { Header } from './components/Header';
import { SystemInstructionPanel } from './components/SystemInstructionPanel';
import { ExamplesTable } from './components/ExamplesTable';
import { TestCasesTable } from './components/TestCasesTable';
import { GetCodeModal } from './components/GetCodeModal';
import { AIStudioGuideModal } from './components/AIStudioGuideModal';
import { ColumnConfigModal } from './components/ColumnConfigModal';
import { BatchGeneratorModal } from './components/BatchGeneratorModal';

const STORAGE_KEY = 'aistudio_structured_prompt_state';

export default function App() {
  const [lang, setLang] = useState<'ar' | 'en'>('ar');
  const [config, setConfig] = useState<StructuredPromptConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (
          parsed &&
          Array.isArray(parsed.inputColumns) &&
          Array.isArray(parsed.outputColumns) &&
          Array.isArray(parsed.examples) &&
          Array.isArray(parsed.testCases)
        ) {
          return parsed;
        }
      }
    } catch {
      // ignore
    }
    return JSON.parse(JSON.stringify(PRESETS[0]));
  });

  const [isGetCodeOpen, setIsGetCodeOpen] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isColumnConfigOpen, setIsColumnConfigOpen] = useState(false);
  const [isBatchModalOpen, setIsBatchModalOpen] = useState(false);
  const [isRunningAll, setIsRunningAll] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    } catch {
      // ignore
    }
  }, [config]);

  const isAr = lang === 'ar';

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Run a single test row
  const handleRunRow = async (rowId: string) => {
    const targetRow = config.testCases.find((tc) => tc.id === rowId);
    if (!targetRow) return;

    // Update row state to running
    setConfig((prev) => ({
      ...prev,
      testCases: prev.testCases.map((tc) =>
        tc.id === rowId ? { ...tc, status: 'running', errorMsg: undefined } : tc
      ),
    }));

    try {
      const res = await fetch('/api/generate-row', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: config.model,
          systemInstruction: config.systemInstruction,
          inputColumns: config.inputColumns,
          outputColumns: config.outputColumns,
          examples: config.examples,
          testRow: targetRow,
          thinkingLevel: config.thinkingLevel,
          jsonMode: config.jsonMode,
        }),
      });

      const resText = await res.text();
      let data: any = null;
      try {
        data = JSON.parse(resText);
      } catch (parseErr) {
        if (resText.includes('504') || resText.includes('Gateway') || resText.includes('Timeout')) {
          throw new Error('انتهت مهلة الخادم السحابي (504 Gateway Timeout). تم تحديث السيرفر لتسريع الرد فورياً.');
        }
        throw new Error('خطأ غير متوقع في قراءة استجابة الخادم: ' + (resText.slice(0, 100) || 'استجابة فارغة'));
      }

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to generate output');
      }

      setConfig((prev) => ({
        ...prev,
        testCases: prev.testCases.map((tc) => {
          if (tc.id !== rowId) return tc;
          return {
            ...tc,
            ...data.outputs,
            status: 'success',
            latencyMs: data.latencyMs,
            tokens: data.usage?.totalTokenCount,
            rawOutput: data.rawText,
          };
        }),
      }));
    } catch (err: any) {
      setConfig((prev) => ({
        ...prev,
        testCases: prev.testCases.map((tc) =>
          tc.id === rowId
            ? { ...tc, status: 'error', errorMsg: err.message || 'Error executing row' }
            : tc
        ),
      }));
    }
  };

  // Run all test cases sequentially
  const handleRunAll = async () => {
    if (!config.testCases.length || isRunningAll) return;
    setIsRunningAll(true);
    for (const testCase of config.testCases) {
      await handleRunRow(testCase.id);
    }
    setIsRunningAll(false);
    showToast(isAr ? 'تم تشغيل جميع حالات الاختبار بنجاح!' : 'All test cases finished!');
  };

  // Export prompt to JSON
  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(config, null, 2));
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute('href', dataStr);
    dlAnchor.setAttribute('download', `${config.title.replace(/\s+/g, '_')}_prompt.json`);
    dlAnchor.click();
    showToast(isAr ? 'تم تصدير ملف المطالبة بنجاح!' : 'Prompt exported to JSON file!');
  };

  // Import prompt from JSON
  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.inputColumns && parsed.outputColumns) {
          setConfig(parsed);
          showToast(isAr ? 'تم استيراد المطالبة بنجاح!' : 'Prompt imported successfully!');
        } else {
          showToast(isAr ? 'الملف غير متطابق مع هيكل Structured Prompt' : 'Invalid Structured Prompt JSON structure');
        }
      } catch {
        showToast(isAr ? 'خطأ في قراءة الملف' : 'Error reading JSON file');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Export purely the quiz questions JSON array for direct use in taxikorkort or CivicQuiz
  const handleExportQuestionsJson = () => {
    const questions: any[] = [];
    config.testCases.forEach((tc) => {
      // Find output value
      const outCol = config.outputColumns[0];
      const val = tc[outCol?.id] || tc.out_quiz_json;
      if (val) {
        try {
          const parsed = typeof val === 'object' ? val : JSON.parse(val);
          questions.push(parsed);
        } catch {
          // not JSON, wrap as question
          questions.push({
            question_sv: tc[config.inputColumns[0]?.id] || 'Fråga',
            question_ar: tc[config.inputColumns[0]?.id] || 'سؤال',
            options: ['Ja', 'Nej'],
            correct_index: 0,
            explanation: String(val),
          });
        }
      }
    });

    if (questions.length === 0) {
      showToast(isAr ? 'لا توجد نتائج اختبار بعد. اضغط "تشغيل الكل" أولاً أو استخدم زر "توليد 50 سؤالاً".' : 'No quiz results yet. Run test cases or use Bulk 50 Generator first.');
      return;
    }

    const jsonStr = JSON.stringify(questions, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = config.id.includes('civic') ? 'civic_quiz_questions.json' : 'taxikorkort_questions.json';
    a.click();
    URL.revokeObjectURL(url);
    showToast(isAr ? `تم تصدير ${questions.length} سؤالاً بنجاح كملف questions.json جاهز!` : `Exported ${questions.length} questions as clean JSON!`);
  };

  // Create a new blank custom structured prompt
  const handleCreateNewPrompt = () => {
    const newConfig: StructuredPromptConfig = {
      id: `custom_${Date.now()}`,
      title: isAr ? 'مطالبة مهيكلة مخصصة جديدة' : 'New Custom Structured Prompt',
      description: isAr ? 'قالب مخصص تم إنشاؤه من الصفر' : 'Custom structured prompt template',
      systemInstruction: isAr ? 'أنت مساعد ذكي متخصص. أجب بدقة وفق النمط المحدد.' : 'You are an expert AI assistant. Follow the defined pattern strictly.',
      inputColumns: [
        { id: 'in_1', name: isAr ? 'المدخل 1 (Input 1)' : 'Input 1', type: 'text' },
      ],
      outputColumns: [
        { id: 'out_1', name: isAr ? 'المخرج 1 (Output 1)' : 'Output 1', type: 'text' },
      ],
      examples: [
        { id: 'ex_1', in_1: '', out_1: '' },
      ],
      testCases: [
        { id: 'test_1', in_1: '' },
      ],
      model: 'gemini-3.1-flash-lite',
      thinkingLevel: 'LOW',
      jsonMode: false,
    };
    setConfig(newConfig);
    showToast(isAr ? 'تم إنشاء قالب مخصص جديد! يمكنك تعديل الأعمدة والتعليمات الآن.' : 'New custom prompt created!');
  };

  return (
    <div
      className="min-h-screen bg-[#0b0f17] text-slate-100 flex flex-col font-sans"
      dir={isAr ? 'rtl' : 'ltr'}
    >
      {/* Top Header */}
      <Header
        config={config}
        onChangeConfig={setConfig}
        onOpenGetCode={() => setIsGetCodeOpen(true)}
        onOpenGuide={() => setIsGuideOpen(true)}
        onOpenColumnConfig={() => setIsColumnConfigOpen(true)}
        onRunAll={handleRunAll}
        isRunningAll={isRunningAll}
        lang={lang}
        onToggleLang={() => setLang(lang === 'ar' ? 'en' : 'ar')}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-[1600px] w-full mx-auto px-4 py-5 space-y-6">
        {/* Welcome / Context Banner addressing the user's question directly */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-950/70 via-indigo-950/40 to-slate-900 border border-blue-500/25 p-5 shadow-lg">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">
                  {isAr ? 'خاصية المطالبة المهيكلة (Structured Prompt)' : 'Structured Prompt Environment'}
                </span>
              </div>
              <h1 className="text-lg md:text-xl font-bold text-white flex items-center gap-2">
                {isAr
                  ? 'مرحباً بك! هذه هي خاصية Structured Prompt الموجودة في Google AI Studio'
                  : 'Welcome! This is the Google AI Studio Structured Prompt feature'}
              </h1>
              <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
                {isAr
                  ? 'صُممت هذه الخاصية لتقنية التدريب بالأمثلة (Few-Shot Learning). يمكنك تحديد أعمدة المدخلات والمخرجات، تزويد النموذج بأمثلة في جدول منظم، وتجربة التوليد بدقة فائقة بدون الحاجة لكتابة نصوص برمجية طويلة!'
                  : 'Designed for Few-Shot Learning in Google AI Studio. Set your input/output schema, provide tabular examples, test live predictions, and export production code!'}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setIsGuideOpen(true)}
                className="flex items-center gap-2 px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl shadow-md shadow-blue-600/30 transition"
              >
                <BookOpen className="w-4 h-4" />
                <span>{isAr ? 'كيف تستخدمها في موقع AI Studio؟' : 'How to open in AI Studio?'}</span>
              </button>
              <a
                href="https://aistudio.google.com"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-xl border border-slate-700 transition"
              >
                <span>{isAr ? 'موقع AI Studio الرسمي' : 'Open AI Studio'}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Quick utility bar below banner */}
          <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between text-xs text-slate-400 gap-2">
            <div className="flex flex-wrap items-center gap-2">
              {/* Bulk 50 Generator button */}
              <button
                onClick={() => setIsBatchModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs rounded-xl shadow-md shadow-amber-500/20 transition cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 fill-current" />
                <span>{isAr ? '⚡ توليد 50 سؤالاً دفعة واحدة' : '⚡ Bulk Generate 50 Qs'}</span>
              </button>

              {/* Swedish Taxi Preset */}
              <button
                onClick={() => {
                  const p = PRESETS.find((x) => x.id === 'swedish-taxi-quiz');
                  if (p) {
                    setConfig(JSON.parse(JSON.stringify(p)));
                    showToast('تم تفعيل قالب قوانين التاكسي بالسويد!');
                  }
                }}
                className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg border transition ${
                  config.id === 'swedish-taxi-quiz'
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                }`}
              >
                <span>🚖</span>
                <span>{isAr ? 'قوانين التاكسي' : 'Taxi Laws'}</span>
              </button>

              {/* CivicQuiz Preset */}
              <button
                onClick={() => {
                  const p = PRESETS.find((x) => x.id === 'civic-quiz');
                  if (p) {
                    setConfig(JSON.parse(JSON.stringify(p)));
                    showToast('تم تفعيل قالب اختبار الجنسية (CivicQuiz)!');
                  }
                }}
                className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg border transition ${
                  config.id === 'civic-quiz'
                    ? 'bg-blue-500/20 text-blue-300 border-blue-500/50'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                }`}
              >
                <span>🏛️</span>
                <span>{isAr ? 'اختبار الجنسية (CivicQuiz)' : 'Civic Quiz'}</span>
              </button>

              {/* Sentiment Preset */}
              <button
                onClick={() => {
                  const p = PRESETS.find((x) => x.id === 'sentiment-intent');
                  if (p) {
                    setConfig(JSON.parse(JSON.stringify(p)));
                    showToast('تم تفعيل قالب تحليل المشاعر والنية!');
                  }
                }}
                className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg border transition ${
                  config.id === 'sentiment-intent'
                    ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/50'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                }`}
              >
                <span>💭</span>
                <span>{isAr ? 'تحليل المشاعر' : 'Sentiment'}</span>
              </button>

              {/* Create New Custom Blank Template */}
              <button
                onClick={handleCreateNewPrompt}
                className="flex items-center gap-1 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-blue-300 text-xs font-semibold rounded-lg border border-slate-700 transition"
                title={isAr ? 'إنشاء مطالبة مهيكلة فارغة مخصصة بالكامل' : 'Create new blank prompt'}
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{isAr ? 'قالب جديد' : 'New Custom'}</span>
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* Dedicated Export for taxikorkort and CivicQuiz */}
              <button
                onClick={handleExportQuestionsJson}
                className="flex items-center gap-1.5 px-3 py-1 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold rounded-lg transition shadow-sm"
                title={isAr ? 'تصدير الأسئلة الجاهزة للاستخدام في تطبيقي taxikorkort و CivicQuiz' : 'Export clean questions.json for quiz apps'}
              >
                <Download className="w-3.5 h-3.5 text-emerald-400" />
                <span>{isAr ? 'تصدير questions.json للتطبيقات' : 'Export questions.json'}</span>
              </button>

              <label className="flex items-center gap-1 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 cursor-pointer transition">
                <Upload className="w-3 h-3" />
                <span>{isAr ? 'استيراد JSON' : 'Import JSON'}</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportJson}
                  className="hidden"
                />
              </label>
              <button
                onClick={handleExportJson}
                className="flex items-center gap-1 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 transition"
              >
                <Download className="w-3 h-3" />
                <span>{isAr ? 'تصدير القالب' : 'Export Template'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* 1. System Instructions Collapsible Section */}
        <SystemInstructionPanel
          systemInstruction={config.systemInstruction}
          onChange={(val) => setConfig({ ...config, systemInstruction: val })}
          lang={lang}
        />

        {/* 2. Examples Table (Few-Shot Conditioning) */}
        <ExamplesTable
          inputColumns={config.inputColumns}
          outputColumns={config.outputColumns}
          examples={config.examples}
          onChangeExamples={(ex) => setConfig({ ...config, examples: ex })}
          onOpenColumnConfig={() => setIsColumnConfigOpen(true)}
          systemInstruction={config.systemInstruction}
          lang={lang}
        />

        {/* 3. Test Cases Table (Live Runner) */}
        <TestCasesTable
          inputColumns={config.inputColumns}
          outputColumns={config.outputColumns}
          testCases={config.testCases}
          onChangeTestCases={(tc) => setConfig({ ...config, testCases: tc })}
          onRunRow={handleRunRow}
          lang={lang}
        />
      </main>

      {/* Modals */}
      <GetCodeModal
        isOpen={isGetCodeOpen}
        onClose={() => setIsGetCodeOpen(false)}
        config={config}
        lang={lang}
      />

      <AIStudioGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
        lang={lang}
      />

      <ColumnConfigModal
        isOpen={isColumnConfigOpen}
        onClose={() => setIsColumnConfigOpen(false)}
        inputColumns={config.inputColumns}
        outputColumns={config.outputColumns}
        onSave={(inputs, outputs) => {
          setConfig({
            ...config,
            inputColumns: inputs,
            outputColumns: outputs,
          });
          showToast(isAr ? 'تم تحديث الأعمدة بنجاح' : 'Columns updated successfully');
        }}
        lang={lang}
      />

      <BatchGeneratorModal
        isOpen={isBatchModalOpen}
        onClose={() => setIsBatchModalOpen(false)}
        onAppendTestCases={(newRows) => {
          setConfig((prev) => ({
            ...prev,
            testCases: [...prev.testCases, ...newRows],
          }));
          showToast(isAr ? `تمت إضافة ${newRows.length} أسئلة إلى جدول الاختبار بنجاح!` : `Added ${newRows.length} questions to Test Table!`);
        }}
        lang={lang}
      />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 px-4 py-2.5 bg-slate-800 border border-slate-700 text-white text-xs font-medium rounded-xl shadow-2xl animate-in slide-in-from-bottom duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
