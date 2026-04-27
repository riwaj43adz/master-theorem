import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Code, Play, RefreshCw, AlertCircle, Copy, Check, ChevronRight } from 'lucide-react';
import { generateRecursiveCode, analyzeCode } from '../utils/codeUtils';
import { fnOptions } from '../utils/masterTheorem';

interface CodeLabProps {
  a: number;
  b: number;
  fnId: string;
  onApplyRecurrence: (a: number, b: number, fnId: string) => void;
}

const CodeLab: React.FC<CodeLabProps> = ({ a, b, fnId, onApplyRecurrence }) => {
  const fn = fnOptions.find(o => o.id === fnId) || fnOptions[2];
  const [generatedCode, setGeneratedCode] = useState('');
  const [userCode, setUserCode] = useState('');
  const [analysis, setAnalysis] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'generate' | 'analyze'>('generate');

  useEffect(() => {
    const code = generateRecursiveCode(a, b, fn.d, fn.k);
    setGeneratedCode(code);
    if (activeTab === 'generate') {
      setUserCode(code);
      setAnalysis(null);
    }
  }, [a, b, fnId, activeTab]);

  const handleAnalyze = () => {
    console.log("Analyzing code...");
    const result = analyzeCode(userCode);
    console.log("Analysis result:", result);
    setAnalysis(result);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(userCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleApply = () => {
    if (analysis && analysis.isValid) {
      const matchedFn = fnOptions.find(o => o.d === analysis.d && o.k === analysis.k) || fnOptions[2];
      onApplyRecurrence(analysis.a, analysis.b, matchedFn.id);
    }
  };

  return (
    <div className="flex flex-col h-full w-full gap-10">
      {/* Header Tabs */}
      <div className="flex items-center justify-between px-2">
        <div className="flex bg-slate-100/80 p-1.5 rounded-2xl border border-slate-200/50 backdrop-blur-sm">
          <button
            onClick={() => setActiveTab('generate')}
            className={`px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 ${
              activeTab === 'generate' ? 'bg-white text-primary shadow-md border border-slate-200' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            Generate Logic
          </button>
          <button
            onClick={() => setActiveTab('analyze')}
            className={`px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 ${
              activeTab === 'analyze' ? 'bg-white text-primary shadow-md border border-slate-200' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            Analyze Code
          </button>
        </div>

        <div className="flex items-center gap-4">
           <button 
             onClick={handleCopy}
             className="p-4 bg-white hover:bg-slate-50 border border-slate-200 rounded-2xl transition-all shadow-sm text-slate-400 hover:text-primary group"
             title="Copy Code"
           >
             {copied ? <Check className="w-5 h-5 text-leaves" /> : <Copy className="w-5 h-5 group-hover:scale-110 transition-transform" />}
           </button>
           <button 
             onClick={() => {
               setUserCode(generatedCode);
               setAnalysis(null);
             }}
             className="p-4 bg-white hover:bg-slate-50 border border-slate-200 rounded-2xl transition-all shadow-sm text-slate-400 hover:text-primary group"
             title="Reset Code"
           >
             <RefreshCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
           </button>
        </div>
      </div>

      <div className="flex-1 flex gap-12 min-h-0">
        {/* Editor Side */}
        <div className="flex-[7] flex flex-col gap-6 min-w-0">
          <div className="flex-1 relative glass-panel rounded-[40px] overflow-hidden border-slate-200 shadow-2xl">
            {/* Tab Bar UI */}
            <div className="absolute top-0 left-0 right-0 h-12 bg-slate-50 border-b border-slate-100 flex items-center justify-between px-8">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-slate-200" />
                <div className="w-3 h-3 rounded-full bg-slate-200" />
                <div className="w-3 h-3 rounded-full bg-slate-200" />
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-[0.3em] font-bold">complexity_engine.js</span>
              </div>
            </div>
            <textarea
              id="code-editor"
              value={userCode}
              onChange={(e) => setUserCode(e.target.value)}
              className="w-full h-full pt-16 pb-10 px-10 bg-white text-indigo-950 font-mono text-[15px] resize-none focus:outline-none custom-scrollbar leading-relaxed selection:bg-primary/10"
              spellCheck={false}
              placeholder="Type your recursive function here..."
            />
          </div>
          
          {activeTab === 'analyze' && (
            <motion.button
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleAnalyze}
              className="w-full py-6 bg-primary hover:bg-primary-light text-white rounded-[24px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-4 transition-all shadow-2xl shadow-primary/30"
            >
              <Play className="w-5 h-5 fill-current" />
              Run Complexity Analysis
            </motion.button>
          )}
        </div>

        {/* Results Side */}
        <div className="flex-[5] flex flex-col gap-8 overflow-y-auto custom-scrollbar pr-4">
          <div className="glass-panel rounded-[40px] p-10 space-y-10">
            <div>
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-8 flex items-center gap-4">
                <div className="p-2 bg-primary/10 rounded-xl">
                   <Code className="w-5 h-5 text-primary" />
                </div>
                {activeTab === 'generate' ? 'Structural Mapping' : 'Analysis Output'}
              </h3>
              
              {activeTab === 'generate' ? (
                <div className="space-y-8">
                  <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 shadow-inner">
                    <p className="text-[10px] text-slate-400 uppercase font-black tracking-[0.2em] mb-3">Model Definition</p>
                    <p className="text-xl font-mono text-primary font-black tracking-tight">T(n) = {a}T(n/{b}) + {fn.label}</p>
                  </div>
                  <div className="space-y-5 px-2">
                    <div className="flex items-center gap-5 text-[14px] text-slate-600 font-bold">
                      <div className="w-2.5 h-2.5 rounded-full bg-primary shadow-sm" />
                      <span>{a} recursive branches</span>
                    </div>
                    <div className="flex items-center gap-5 text-[14px] text-slate-600 font-bold">
                      <div className="w-2.5 h-2.5 rounded-full bg-accent shadow-sm" />
                      <span>Division factor b = {b}</span>
                    </div>
                    <div className="flex items-center gap-5 text-[14px] text-slate-600 font-bold">
                      <div className="w-2.5 h-2.5 rounded-full bg-root shadow-sm" />
                      <span>Work function: {fn.label}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <AnimatePresence mode="wait">
                  {analysis ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="space-y-8"
                    >
                      {analysis.isValid ? (
                        <>
                          <div className="grid grid-cols-2 gap-6">
                            <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 shadow-sm">
                              <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mb-2">Detected a</p>
                              <p className="text-3xl font-black text-slate-900 tracking-tighter">{analysis.a}</p>
                            </div>
                            <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 shadow-sm">
                              <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mb-2">Detected b</p>
                              <p className="text-3xl font-black text-slate-900 tracking-tighter">{analysis.b}</p>
                            </div>
                          </div>
                          <div className="p-8 bg-primary/5 rounded-[32px] border border-primary/10 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                               <RefreshCw className="w-12 h-12 rotate-12" />
                            </div>
                            <p className="text-[10px] text-primary uppercase font-black tracking-widest mb-3">Extracted Recurrence</p>
                            <p className="text-xl font-mono text-slate-900 font-black tracking-tight relative z-10">
                              T(n) = {analysis.a}T(n/{analysis.b}) + Θ(n<sup>{analysis.d}</sup>{analysis.k > 0 ? ' log n' : ''})
                            </p>
                          </div>
                          <button
                            onClick={handleApply}
                            className="w-full py-5 bg-slate-900 hover:bg-black text-white rounded-[24px] text-[12px] font-black uppercase tracking-widest transition-all shadow-xl flex items-center justify-center gap-3"
                          >
                            Sync with Visualizer
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </>
                      ) : (
                        <div className="p-6 bg-red-50 rounded-3xl border border-red-100 flex gap-5">
                          <div className="p-2 bg-red-100 rounded-xl h-fit">
                             <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
                          </div>
                          <div>
                            <p className="text-[11px] font-black text-red-700 uppercase tracking-widest">Incompatible Logic</p>
                            <p className="text-[14px] text-red-600/90 mt-2 leading-relaxed font-bold">{analysis.error}</p>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  ) : (
                    <div className="py-20 text-center">
                      <div className="inline-flex p-6 rounded-full bg-slate-50 border border-slate-100 mb-8 shadow-inner">
                        <Play className="w-8 h-8 text-slate-200" />
                      </div>
                      <p className="text-xs text-slate-400 font-bold leading-relaxed px-6 tracking-tight uppercase max-w-[240px] mx-auto">
                        Insert recursive code to extract Master Theorem parameters.
                      </p>
                    </div>
                  )}
                </AnimatePresence>
              )}
            </div>
            
            <div className="pt-10 border-t border-slate-100">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6">Extraction Rules</p>
              <ul className="space-y-4 text-[13px] text-slate-500 leading-relaxed font-bold">
                <li className="flex gap-4">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0 shadow-sm" />
                  <span>Call format: <code className="text-primary px-1.5 py-0.5 bg-primary/5 rounded">solve(n / b)</code>.</span>
                </li>
                <li className="flex gap-4">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0 shadow-sm" />
                  <span>Loops determine the <code className="text-slate-900">f(n)</code> term.</span>
                </li>
                <li className="flex gap-4">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0 shadow-sm" />
                  <span>Only <code className="text-slate-900">O(n^d)</code> or <code className="text-slate-900">O(n^d log n)</code> is supported.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeLab;
