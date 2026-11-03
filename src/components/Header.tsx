import React from 'react';
import {
  Sparkles,
  TableProperties,
  Code2,
  BookOpen,
  SlidersHorizontal,
  Play,
  RotateCcw,
  Languages,
  Braces,
  Cpu,
  Layers,
} from 'lucide-react';
import { StructuredPromptConfig } from '../types/prompt';
import { PRESETS } from '../data/presets';

interface Props {
  config: StructuredPromptConfig;
  onChangeConfig: (config: StructuredPromptConfig) => void;
  onOpenGetCode: () => void;
  onOpenGuide: () => void;
  onOpenColumnConfig: () => void;
  onRunAll: () => void;
  isRunningAll: boolean;
  lang: 'ar' | 'en';
  onToggleLang: () => void;
}

export const Header: React.FC<Props> = ({
  config,
  onChangeConfig,
  onOpenGetCode,
  onOpenGuide,
  onOpenColumnConfig,
  onRunAll,
  isRunningAll,
  lang,
  onToggleLang,
}) => {
  const isAr = lang === 'ar';

  const handleSelectPreset = (presetId: string) => {
    const found = PRESETS.find((p) => p.id === presetId);
    if (found) {
      onChangeConfig(JSON.parse(JSON.stringify(found)));
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-slate-200">
      <div className="max-w-[1600px] mx-auto px-4 py-2.5 flex flex-wrap items-center justify-between gap-3">
        {/* Left / Branding & Prompt Name */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <TableProperties className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-semibold uppercase tracking-wider text-blue-400">
                  Google AI Studio
                </span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-blue-500/10 text-blue-300 border border-blue-500/20 font-mono">
                  Structured Prompt
                </span>
              </div>
              <input
                type="text"
                value={config.title}
                onChange={(e) => onChangeConfig({ ...config, title: e.target.value })}
                className="text-sm font-bold text-white bg-transparent border-b border-transparent hover:border-slate-700 focus:border-blue-500 focus:outline-none transition px-0.5"
                placeholder={isAr ? 'عنوان المطالبة المهيكلة' : 'Prompt Title'}
              />
            </div>
          </div>

          {/* Preset selector dropdown */}
          <div className="hidden lg:flex items-center gap-1.5 ml-3 pl-3 border-l border-slate-800">
            <Layers className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={config.id}
              onChange={(e) => handleSelectPreset(e.target.value)}
              className="bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-xs text-slate-300 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-blue-500 transition cursor-pointer"
            >
              <option value="" disabled>
                {isAr ? 'اختر قالباً جاهزاً...' : 'Load Preset Template...'}
              </option>
              {PRESETS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Center / Controls: Model, Thinking, JSON */}
        <div className="flex items-center flex-wrap gap-2 text-xs">
          {/* Model Selector */}
          <div className="flex items-center bg-slate-950/70 border border-slate-800 rounded-lg p-0.5">
            <div className="px-2 py-1 text-slate-400 flex items-center gap-1">
              <Cpu className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden sm:inline">{isAr ? 'النموذج:' : 'Model:'}</span>
            </div>
            <select
              value={config.model}
              onChange={(e) => onChangeConfig({ ...config, model: e.target.value })}
              className="bg-slate-900 border-0 text-xs text-white font-medium rounded-md px-2 py-1 focus:ring-1 focus:ring-blue-500 cursor-pointer"
            >
              <option value="gemini-3.8-flash">gemini-3.8-flash (Default)</option>
              <option value="gemini-3.1-flash-lite">gemini-3.1-flash-lite (Fastest)</option>
              <option value="gemini-4-argon">gemini-4-argon (Complex STEM)</option>
            </select>
          </div>

          {/* Thinking Level */}
          <div className="flex items-center bg-slate-950/70 border border-slate-800 rounded-lg p-0.5">
            <span className="px-2 py-1 text-slate-400 hidden sm:inline">
              {isAr ? 'التفكير:' : 'Thinking:'}
            </span>
            <select
              value={config.thinkingLevel}
              onChange={(e) =>
                onChangeConfig({ ...config, thinkingLevel: e.target.value as any })
              }
              className="bg-slate-900 border-0 text-xs text-slate-200 font-medium rounded-md px-2 py-1 focus:ring-1 focus:ring-blue-500 cursor-pointer"
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </select>
          </div>

          {/* JSON Structured Output toggle */}
          <button
            onClick={() => onChangeConfig({ ...config, jsonMode: !config.jsonMode })}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition ${
              config.jsonMode
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm shadow-emerald-500/20'
                : 'bg-slate-800/80 text-slate-400 border-slate-700 hover:text-slate-200'
            }`}
            title={isAr ? 'تفعيل وضع JSON Schema الإجباري' : 'Toggle Structured JSON Output'}
          >
            <Braces className="w-3.5 h-3.5" />
            <span>JSON Mode</span>
          </button>
        </div>

        {/* Right / Actions */}
        <div className="flex items-center gap-2">
          {/* Column config button */}
          <button
            onClick={onOpenColumnConfig}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-lg border border-slate-700 transition"
            title={isAr ? 'تعديل أعمدة الجدول' : 'Configure Columns'}
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-blue-400" />
            <span className="hidden md:inline">{isAr ? 'الأعمدة' : 'Columns'}</span>
          </button>

          {/* Get Code button (Exact AI Studio) */}
          <button
            onClick={onOpenGetCode}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 transition shadow-sm"
          >
            <Code2 className="w-3.5 h-3.5 text-indigo-400" />
            <span>Get Code</span>
          </button>

          {/* AI Studio Guide button */}
          <button
            onClick={onOpenGuide}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 text-xs font-medium rounded-lg border border-indigo-500/40 transition"
            title={isAr ? 'دليل خاصية Structured Prompt' : 'AI Studio Guide'}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{isAr ? 'الدليل والشرح' : 'Guide'}</span>
          </button>

          {/* Run All Test Cases */}
          <button
            onClick={onRunAll}
            disabled={isRunningAll || !config.testCases.length}
            className="flex items-center gap-2 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-500 text-white text-xs font-semibold rounded-lg shadow-md shadow-blue-600/30 transition cursor-pointer"
          >
            {isRunningAll ? (
              <>
                <RotateCcw className="w-3.5 h-3.5 animate-spin" />
                <span>{isAr ? 'جارِ التشغيل...' : 'Running...'}</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{isAr ? 'تشغيل الكل' : 'Run All'}</span>
              </>
            )}
          </button>

          {/* Language Switch */}
          <button
            onClick={onToggleLang}
            className="p-1.5 bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-lg border border-slate-700 transition"
            title={isAr ? 'Switch to English' : 'التبديل إلى العربية'}
          >
            <Languages className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
