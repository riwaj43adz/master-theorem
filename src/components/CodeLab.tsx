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
      // Map d, k back to fnId if possible, or just use a close match
      const matchedFn = fnOptions.find(o => o.d === analysis.d && o.k === analysis.k) || fnOptions[2];
      onApplyRecurrence(analysis.a, analysis.b, matchedFn.id);
    }
  };

  return (
    <div className="flex flex-col h-full w-full gap-6 p-4">
      <div className="flex items-center justify-between">
        <div className="flex bg-white/5 p-1 rounded-xl border border-white/[0.06]">
          <button
            onClick={() => setActiveTab('generate')}
            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
              activeTab === 'generate' ? 'bg-primary text-white shadow-lg' : 'text-white/40 hover:text-white/60'
            }`}
          >
            Generate Code
          </button>
          <button
            onClick={() => setActiveTab('analyze')}
            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
              activeTab === 'analyze' ? 'bg-primary text-white shadow-lg' : 'text-white/40 hover:text-white/60'
            }`}
          >
            Analyze Code
          </button>
        </div>

        <div className="flex items-center gap-2">
           <button 
             onClick={handleCopy}
             className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors text-white/50 hover:text-white"
             title="Copy Code"
           >
             {copied ? <Check className="w-4 h-4 text-leaves" /> : <Copy className="w-4 h-4" />}
           </button>
           <button 
             onClick={() => setUserCode(generatedCode)}
             className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors text-white/50 hover:text-white"
             title="Reset Code"
           >
             <RefreshCw className="w-4 h-4" />
           </button>
        </div>
      </div>

      <div className="flex-1 flex gap-6 min-h-0">
        {/* Editor Side */}
        <div className="flex-[6] flex flex-col gap-3 min-w-0">
          <div className="flex-1 relative glass-panel rounded-2xl overflow-hidden border-white/[0.08]">
            <div className="absolute top-0 left-0 right-0 h-8 bg-white/[0.03] border-b border-white/[0.03] flex items-center px-4">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/40" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500/40" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/40" />
              </div>
              <span className="ml-4 text-[10px] font-mono text-white/20 uppercase tracking-widest">complexity_solver.js</span>
            </div>
            <textarea
              value={userCode}
              onChange={(e) => setUserCode(e.target.value)}
              className="w-full h-full pt-12 pb-6 px-6 bg-transparent text-primaryLight font-mono text-sm resize-none focus:outline-none custom-scrollbar"
              spellCheck={false}
            />
          </div>
          
          {activeTab === 'analyze' && (
            <button
              onClick={handleAnalyze}
              className="w-full py-4 bg-primary hover:bg-primaryLight text-white rounded-xl font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-xl shadow-primary/20"
            >
              <Play className="w-4 h-4 fill-current" />
              Run Analysis
            </button>
          )}
        </div>

        {/* Results Side */}
        <div className="flex-[4] flex flex-col gap-4 overflow-y-auto custom-scrollbar">
          <div className="glass-panel rounded-2xl p-6 space-y-6">
            <div>
              <h3 className="text-sm font-black text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                <Code className="w-4 h-4 text-primary" />
                {activeTab === 'generate' ? 'Logic Mapping' : 'Analysis Results'}
              </h3>
              
              {activeTab === 'generate' ? (
                <div className="space-y-4">
                  <div className="p-4 bg-white/5 rounded-xl border border-white/[0.05]">
                    <p className="text-[10px] text-white/30 uppercase font-bold mb-1">Recurrence</p>
                    <p className="text-sm font-mono text-accent">T(n) = {a}T(n/{b}) + {fn.label}</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 text-xs text-white/60">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      <span>{a} recursive calls detected</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-white/60">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      <span>Input reduction factor b = {b}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-white/60">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      <span>Work per level: {fn.label}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <AnimatePresence mode="wait">
                  {analysis ? (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-4"
                    >
                      {analysis.isValid ? (
                        <>
                          <div className="grid grid-cols-2 gap-3">
                            <div className="p-3 bg-white/5 rounded-xl border border-white/[0.05]">
                              <p className="text-[10px] text-white/30 uppercase font-bold mb-0.5">Detected a</p>
                              <p className="text-xl font-black text-white">{analysis.a}</p>
                            </div>
                            <div className="p-3 bg-white/5 rounded-xl border border-white/[0.05]">
                              <p className="text-[10px] text-white/30 uppercase font-bold mb-0.5">Detected b</p>
                              <p className="text-xl font-black text-white">{analysis.b}</p>
                            </div>
                          </div>
                          <div className="p-4 bg-primary/10 rounded-xl border border-primary/20">
                            <p className="text-[10px] text-primaryLight uppercase font-bold mb-1">Derived Recurrence</p>
                            <p className="text-lg font-mono text-white font-black">
                              T(n) = {analysis.a}T(n/{analysis.b}) + Θ(n<sup>{analysis.d}</sup>{analysis.k > 0 ? ' log n' : ''})
                            </p>
                          </div>
                          <button
                            onClick={handleApply}
                            className="w-full py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all"
                          >
                            Apply to Visualizer
                          </button>
                        </>
                      ) : (
                        <div className="p-4 bg-red-500/10 rounded-xl border border-red-500/20 flex gap-3">
                          <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
                          <div>
                            <p className="text-xs font-bold text-red-500 uppercase">Analysis Failed</p>
                            <p className="text-xs text-red-400/80 mt-1">{analysis.error}</p>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  ) : (
                    <div className="py-12 text-center">
                      <div className="inline-flex p-4 rounded-full bg-white/5 mb-4">
                        <Play className="w-6 h-6 text-white/20" />
                      </div>
                      <p className="text-xs text-white/30 font-medium">Enter your recursive code and click Run Analysis to detect recurrence parameters.</p>
                    </div>
                  )}
                </AnimatePresence>
              )}
            </div>
            
            <div className="pt-6 border-t border-white/[0.06]">
              <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest mb-3">Analysis Tips</p>
              <ul className="space-y-2 text-[11px] text-white/40 leading-relaxed">
                <li className="flex gap-2">
                  <span className="text-primary font-black">•</span>
                  <span>Ensure recursive calls use the form <code className="text-primaryLight">solve(n / b)</code>.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary font-black">•</span>
                  <span>The analyzer detects <code className="text-primaryLight">for</code> loops to determine the driving cost <code className="text-white/60">f(n)</code>.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary font-black">•</span>
                  <span>Master Theorem only applies if all subproblems have the same size <code className="text-white/60">b</code>.</span>
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
