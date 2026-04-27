import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ControlPanel from './components/ControlPanel';
import ExamplesPanel from './components/ExamplesPanel';
import RecursionTree from './components/RecursionTree';
import PredictionPanel from './components/PredictionPanel';
import GrowthChart from './components/GrowthChart';
import StepExpansion from './components/StepExpansion';
import ResultsPanel from './components/ResultsPanel';
import CodeLab from './components/CodeLab';
import { getMasterTheoremCase, fnOptions } from './utils/masterTheorem';
import type { DominantPart } from './utils/masterTheorem';
import { Zap, Layout, Code2, Info, ChevronRight } from 'lucide-react';

type ViewMode = 'visualizer' | 'codelab';

function App() {
  const [a, setA] = useState(2);
  const [b, setB] = useState(2);
  const [fnId, setFnId] = useState('n');
  const [prediction, setPrediction] = useState<DominantPart | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('visualizer');

  const fn = useMemo(() => fnOptions.find(o => o.id === fnId) || fnOptions[2], [fnId]);
  const result = useMemo(() => getMasterTheoremCase(a, b, fn), [a, b, fn]);

  // Reset prediction when params change
  const handleA = (v: number) => { setA(v); setPrediction(null); };
  const handleB = (v: number) => { setB(v); setPrediction(null); };
  const handleFn = (v: string) => { setFnId(v); setPrediction(null); };
  const handleExample = (na: number, nb: number, nf: string) => {
    setA(na); setB(nb); setFnId(nf); setPrediction(null);
  };

  const handleApplyFromCode = (na: number, nb: number, nfnId: string) => {
    setA(na); setB(nb); setFnId(nfnId);
    setPrediction(null);
    setViewMode('visualizer');
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background text-text-main font-sans selection:bg-primary/10">
      {/* ─── SIDEBAR ─── */}
      <aside className="w-80 shrink-0 bg-white border-r border-slate-200 flex flex-col z-30 shadow-sm">
        {/* Brand */}
        <div className="p-8 pb-6">
          <div className="flex items-center gap-3 mb-10">
            <div className="p-2.5 bg-primary/5 rounded-xl border border-primary/10 shadow-sm">
              <Zap className="text-primary w-5 h-5 fill-primary" />
            </div>
            <div>
              <h1 className="text-lg font-black tracking-tight uppercase leading-none text-slate-900">
                Master <span className="text-primary">Theorem</span>
              </h1>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-1.5">Lab Edition</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="space-y-2 mb-10">
            <button
              onClick={() => setViewMode('visualizer')}
              className={`w-full flex items-center justify-between px-5 py-3.5 rounded-2xl transition-all duration-300 ${
                viewMode === 'visualizer' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
              }`}
            >
              <div className="flex items-center gap-3">
                <Layout className="w-4 h-4" />
                <span className="text-[11px] font-black uppercase tracking-widest">Visualizer</span>
              </div>
              {viewMode === 'visualizer' && <ChevronRight className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={() => setViewMode('codelab')}
              className={`w-full flex items-center justify-between px-5 py-3.5 rounded-2xl transition-all duration-300 ${
                viewMode === 'codelab' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
              }`}
            >
              <div className="flex items-center gap-3">
                <Code2 className="w-4 h-4" />
                <span className="text-[11px] font-black uppercase tracking-widest">Code Lab</span>
              </div>
              {viewMode === 'codelab' && <ChevronRight className="w-3.5 h-3.5" />}
            </button>
          </nav>

          <div className="h-px bg-slate-100 mb-10" />
        </div>

        {/* Scrollable controls */}
        <div className="flex-1 overflow-y-auto custom-scrollbar px-8 pb-10 space-y-12">
          <ControlPanel
            a={a} setA={handleA}
            b={b} setB={handleB}
            fnId={fnId} setFnId={handleFn}
          />
          
          <ExamplesPanel
            onSelect={handleExample}
            currentA={a} currentB={b} currentFnId={fnId}
          />

          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 space-y-4">
            <div className="flex items-center gap-2.5 text-slate-400">
              <Info className="w-3.5 h-3.5" />
              <span className="text-[10px] font-black uppercase tracking-widest">Theorem Logic</span>
            </div>
            <p className="text-[12px] text-slate-500 leading-relaxed font-medium">
              Evaluating <span className="text-primary font-mono font-bold">T(n) = {a}T(n/{b}) + {fn.label}</span>. 
              The Master Theorem compares the driving function to the recursive branching.
            </p>
          </div>
        </div>
      </aside>

      {/* ─── MAIN AREA ─── */}
      <main className="flex-1 flex flex-col min-w-0 relative overflow-hidden bg-[#fafbfc]">
        {/* Decorative Grid */}
        <div className="absolute inset-0 bg-grid-pattern bg-grid-40 opacity-[0.4] pointer-events-none" />
        
        {/* Top bar */}
        <header className="shrink-0 px-12 py-10 flex justify-between items-center z-20">
          <div>
            <div className="flex items-center gap-3 mb-2">
               <span className="px-2.5 py-1 rounded-lg bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest">Interactive Solver</span>
               <h2 className="text-4xl font-black tracking-tight text-slate-900">
                {viewMode === 'visualizer' ? 'Recurrence Explorer' : 'Complexity Code Lab'}
              </h2>
            </div>
            <p className="text-sm text-slate-500 font-medium max-w-xl">
              {viewMode === 'visualizer' 
                ? 'Understand asymptotic complexity through interactive tree modeling and work distribution analysis.' 
                : 'Convert recursive definitions into efficient code and analyze existing logic for complexity.'}
            </p>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={`${a}-${b}-${viewMode}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="glass-panel px-8 py-5 rounded-3xl flex flex-col items-end border-slate-200/60 shadow-xl shadow-slate-200/20"
            >
              <div className="label-micro mb-2">Critical Exponent</div>
              <div className="text-3xl font-mono font-black text-accent tracking-tighter">
                log<sub className="text-[12px]">{b}</sub>({a}) ≈ {result.logBa.toFixed(2)}
              </div>
            </motion.div>
          </AnimatePresence>
        </header>

        {/* Content area */}
        <div className="flex-1 relative z-10 px-12 pb-12 min-h-0">
          <AnimatePresence mode="wait">
            {viewMode === 'visualizer' ? (
              <motion.div 
                key="visualizer"
                initial={{ opacity: 0, scale: 0.99 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.01 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="h-full flex gap-10 min-h-0"
              >
                {/* Tree visualization */}
                <div className="flex-[7] glass-panel rounded-[40px] relative overflow-hidden flex items-center justify-center border-slate-200/60 shadow-2xl shadow-slate-200/40">
                  <div className="absolute inset-0 bg-white" />
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(79,70,229,0.04),transparent_70%)]" />
                  <RecursionTree
                    a={a} b={b} fnId={fnId}
                    revealedDominant={prediction ? result.dominant : null}
                  />
                </div>

                {/* Right panel */}
                <div className="flex-[5] flex flex-col gap-8 overflow-y-auto custom-scrollbar pr-4">
                  <PredictionPanel
                    result={result}
                    userPrediction={prediction}
                    onPredict={setPrediction}
                    onReset={() => setPrediction(null)}
                  />
                  <GrowthChart a={a} b={b} fn={fn} result={result} />
                  <StepExpansion a={a} b={b} fn={fn} />
                  <ResultsPanel result={result} revealed={!!prediction} />
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="codelab"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="h-full"
              >
                <CodeLab 
                  a={a} b={b} fnId={fnId} 
                  onApplyRecurrence={handleApplyFromCode}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

export default App;
