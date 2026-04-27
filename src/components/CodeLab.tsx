import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Code, Play, RefreshCw, AlertCircle, Copy, Check } from 'lucide-react';
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
    }
  }, [a, b, fnId, activeTab]);

  const handleAnalyze = () => {
    const result = analyzeCode(userCode);
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
    <div className="flex flex-col h-full w-full gap-8">
      <div className="flex items-center justify-between">
        <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200">
          <button
            onClick={() => setActiveTab('generate')}
            className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
              activeTab === 'generate' ? 'bg-white text-primary shadow-sm border border-slate-200' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            Generate
          </button>
          <button
            onClick={() => setActiveTab('analyze')}
            className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
              activeTab === 'analyze' ? 'bg-white text-primary shadow-sm border border-slate-200' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            Analyze
          </button>
        </div>

        <div className="flex items-center gap-3">
           <button 
             onClick={handleCopy}
             className="p-3 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-all shadow-sm text-slate-400 hover:text-primary"
             title="Copy Code"
           >
             {copied ? <Check className="w-4 h-4 text-leaves" /> : <Copy className="w-4 h-4" />}
           </button>
           <button 
             onClick={() => setUserCode(generatedCode)}
             className="p-3 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-all shadow-sm text-slate-400 hover:text-primary"
             title="Reset Code"
           >
             <RefreshCw className="w-4 h-4" />
           </button>
        </div>
      </div>

      <div className="flex-1 flex gap-10 min-h-0">
        {/* Editor Side */}
        <div className="flex-[6] flex flex-col gap-4 min-w-0">
          <div className="flex-1 relative glass-panel rounded-[32px] overflow-hidden border-slate-200/60 shadow-xl">
            <div className="absolute top-0 left-0 right-0 h-10 bg-slate-50 border-b border-slate-100 flex items-center px-6">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-slate-200" />
                <div className="w-2.5 h-2.5 rounded-full bg-slate-200" />
                <div className="w-2.5 h-2.5 rounded-full bg-slate-200" />
              </div>
              <span className="ml-5 text-[10px] font-mono text-slate-400 uppercase tracking-[0.2em] font-bold">solver.js</span>
            </div>
            <textarea
              value={userCode}
              onChange={(e) => setUserCode(e.target.value)}
              className="w-full h-full pt-14 pb-8 px-8 bg-white text-slate-700 font-mono text-sm resize-none focus:outline-none custom-scrollbar leading-relaxed"
              spellCheck={false}
            />
          </div>
          
          {activeTab === 'analyze' && (
            <button
              onClick={handleAnalyze}
              className="w-full py-5 bg-primary hover:bg-primaryLight text-white rounded-[20px] font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all shadow-xl shadow-primary/20"
            >
              <Play className="w-4 h-4 fill-current" />
              Start Analysis
            </button>
          )}
        </div>

        {/* Results Side */}
        <div className="flex-[4] flex flex-col gap-6 overflow-y-auto custom-scrollbar pr-2">
          <div className="glass-panel rounded-[32px] p-8 space-y-8">
            <div>
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-3">
                <div className="p-1.5 bg-primary/10 rounded-lg">
                   <Code className="w-4 h-4 text-primary" />
                </div>
                {activeTab === 'generate' ? 'Logic Summary' : 'Analysis Output'}
              </h3>
              
              {activeTab === 'generate' ? (
                <div className="space-y-6">
                  <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mb-2">Mapped Recurrence</p>
                    <p className="text-base font-mono text-primary font-bold">T(n) = {a}T(n/{b}) + {fn.label}</p>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 text-[13px] text-slate-600 font-medium">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                      <span>{a} recursive subproblems</span>
                    </div>
                    <div className="flex items-center gap-4 text-[13px] text-slate-600 font-medium">
                      <div className="w-2 h-2 rounded-full bg-accent" />
                      <span>Input division factor b = {b}</span>
                    </div>
                    <div className="flex items-center gap-4 text-[13px] text-slate-600 font-medium">
                      <div className="w-2 h-2 rounded-full bg-root" />
                      <span>Driving cost: {fn.label}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <AnimatePresence mode="wait">
                  {analysis ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="space-y-6"
                    >
                      {analysis.isValid ? (
                        <>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                              <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mb-1">Found a</p>
                              <p className="text-2xl font-black text-slate-900 tracking-tighter">{analysis.a}</p>
                            </div>
                            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                              <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mb-1">Found b</p>
                              <p className="text-2xl font-black text-slate-900 tracking-tighter">{analysis.b}</p>
                            </div>
                          </div>
                          <div className="p-6 bg-primary/5 rounded-[24px] border border-primary/10">
                            <p className="text-[10px] text-primary uppercase font-black tracking-widest mb-2">Detected Recurrence</p>
                            <p className="text-lg font-mono text-slate-900 font-black">
                              T(n) = {analysis.a}T(n/{analysis.b}) + Θ(n<sup>{analysis.d}</sup>{analysis.k > 0 ? ' log n' : ''})
                            </p>
                          </div>
                          <button
                            onClick={handleApply}
                            className="w-full py-4 bg-slate-900 hover:bg-black text-white rounded-[16px] text-[11px] font-black uppercase tracking-widest transition-all shadow-lg"
                          >
                            Apply to Visualizer
                          </button>
                        </>
                      ) : (
                        <div className="p-5 bg-red-50 rounded-2xl border border-red-100 flex gap-4">
                          <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
                          <div>
                            <p className="text-[11px] font-black text-red-600 uppercase tracking-widest">Logic Error</p>
                            <p className="text-[13px] text-red-500/90 mt-1.5 leading-relaxed font-medium">{analysis.error}</p>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  ) : (
                    <div className="py-14 text-center">
                      <div className="inline-flex p-5 rounded-full bg-slate-50 border border-slate-100 mb-6">
                        <Play className="w-6 h-6 text-slate-300" />
                      </div>
                      <p className="text-xs text-slate-400 font-bold leading-relaxed px-4 tracking-tight uppercase">
                        Analyze recursive code to detect Master Theorem parameters.
                      </p>
                    </div>
                  )}
                </AnimatePresence>
              )}
            </div>
            
            <div className="pt-8 border-t border-slate-100">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Requirements</p>
              <ul className="space-y-3 text-[12px] text-slate-500 leading-relaxed font-medium">
                <li className="flex gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                  <span>Recursive calls must be <code className="text-primary font-bold">solve(n / b)</code>.</span>
                </li>
                <li className="flex gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                  <span>The analyzer detects loops for <code className="text-slate-900 font-bold">f(n)</code>.</span>
                </li>
                <li className="flex gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                  <span>Subproblem size <code className="text-slate-900 font-bold">b</code> must be consistent.</span>
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
