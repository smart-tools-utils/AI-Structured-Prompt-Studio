import React, { useState } from 'react';
import { X, Copy, Check, Code, Terminal, FileCode2 } from 'lucide-react';
import { StructuredPromptConfig } from '../types/prompt';
import { generatePythonCode, generateTypeScriptCode, generateCurlCode } from '../utils/codeGenerator';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  config: StructuredPromptConfig;
  lang: 'ar' | 'en';
}

export const GetCodeModal: React.FC<Props> = ({ isOpen, onClose, config, lang }) => {
  const [activeTab, setActiveTab] = useState<'python' | 'typescript' | 'curl'>('python');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const isAr = lang === 'ar';

  const getCodeContent = () => {
    switch (activeTab) {
      case 'python':
        return generatePythonCode(config);
      case 'typescript':
        return generateTypeScriptCode(config);
      case 'curl':
        return generateCurlCode(config);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getCodeContent());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="relative w-full max-w-4xl max-h-[85vh] flex flex-col bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden text-slate-100"
        dir="ltr"
      >
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
              <Code className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                Get Code
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                  Google Gen AI SDK
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                {isAr
                  ? 'كود برمجي جاهز للتشغيل مباشرة في مشاريعك وتطبيقاتك'
                  : 'Ready-to-run code snippet to invoke this Structured Prompt in your app'}
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

        {/* Language Tabs & Copy Button */}
        <div className="flex items-center justify-between px-6 py-2.5 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setActiveTab('python')}
              className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg transition ${
                activeTab === 'python'
                  ? 'bg-blue-600 text-white shadow'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <FileCode2 className="w-3.5 h-3.5" />
              Python (google-genai)
            </button>
            <button
              onClick={() => setActiveTab('typescript')}
              className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg transition ${
                activeTab === 'typescript'
                  ? 'bg-blue-600 text-white shadow'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <FileCode2 className="w-3.5 h-3.5" />
              TypeScript (@google/genai)
            </button>
            <button
              onClick={() => setActiveTab('curl')}
              className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg transition ${
                activeTab === 'curl'
                  ? 'bg-blue-600 text-white shadow'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              cURL (REST API)
            </button>
          </div>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg border border-slate-700 transition"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">{isAr ? 'تم النسخ!' : 'Copied!'}</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>{isAr ? 'نسخ الكود' : 'Copy Code'}</span>
              </>
            )}
          </button>
        </div>

        {/* Code View Area */}
        <div className="flex-1 overflow-y-auto p-4 bg-slate-950 font-mono text-xs text-slate-200">
          <pre className="p-4 rounded-xl bg-slate-900 border border-slate-800/80 overflow-x-auto leading-relaxed select-text">
            <code>{getCodeContent()}</code>
          </pre>
        </div>

        {/* Footer Note */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-900/90 flex items-center justify-between text-xs text-slate-400">
          <span>
            {isAr
              ? 'تأكد من تعيين متغير البيئة GEMINI_API_KEY في السيرفر أو البيئة المحلية الخاصة بك'
              : 'Requires GEMINI_API_KEY environment variable set on your server or system.'}
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
