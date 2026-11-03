import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('UI Render Error caught by boundary:', error, errorInfo);
  }

  handleReset = () => {
    localStorage.removeItem('aistudio_structured_prompt_state');
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0b0f17] flex items-center justify-center p-6 text-slate-100 font-sans" dir="rtl">
          <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl text-center space-y-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto text-2xl">
              ⚠️
            </div>
            <h2 className="text-lg font-bold text-white">حدث خطأ أثناء عرض الواجهة</h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              تم اكتشاف تعارض في الذاكرة المؤقتة. اضغط على الزر أدناه لإعادة تهيئة الواجهة واستعادة القوالب السليمة فوراً.
            </p>
            <button
              onClick={this.handleReset}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-blue-600/30 transition cursor-pointer"
            >
              🔄 إعادة تهيئة وتشغيل الواجهة
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

createRoot(document.getElementById('root')!).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);
