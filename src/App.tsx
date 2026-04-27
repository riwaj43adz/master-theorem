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
    <div className="flex h-screen w-screen overflow-hidden bg-background text-white font-sans selection:bg-primary/30">
      {/* ─── SIDEBAR ─── */}
      <aside className="w-80 shrink-0 bg-surface border-r border-white/[0.06] flex flex-col z-30 shadow-2xl">
        {/* Brand */}
        <div className="p-8 pb-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2.5 bg-primary/15 rounded-xl border border-primary/20 shadow-lg shadow-primary/10">
              <Zap className="text-primary w-5 h-5 fill-primary/20" />
            </div>
            <div>
              <h1 className="text-lg font-black tracking-tight uppercase leading-none">
                Master <span className="text-primary">Theorem</span>
              </h1>
              <p className="text-[10px] text-white/20 font-bold uppercase tracking-[0.2em] mt-1">Algorithm Lab</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="space-y-1.5 mb-10">
            <button
              onClick={() => setViewMode('visualizer')}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 group ${
                viewMode === 'visualizer' ? 'bg-primary/10 text-primary border border-primary/20' : 'text-white/40 hover:bg-white/5 hover:text-white/70 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-3">
                <Layout className="w-4 h-4" />
                <span className="text-xs font-black uppercase tracking-widest">Visualizer</span>
              </div>
              {viewMode === 'visualizer' && <ChevronRight className="w-3 h-3" />}
            </button>
            <button
              onClick={() => setViewMode('codelab')}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 group ${
                viewMode === 'codelab' ? 'bg-primary/10 text-primary border border-primary/20' : 'text-white/40 hover:bg-white/5 hover:text-white/70 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-3">
                <Code2 className="w-4 h-4" />
                <span className="text-xs font-black uppercase tracking-widest">Code Lab</span>
              </div>
              {viewMode === 'codelab' && <ChevronRight className="w-3 h-3" />}
            </button>
          </nav>

          <div className="h-px bg-gradient-to-r from-transparent via-white/[0.05] to-transparent mb-8" />
        </div>

        {/* Scrollable controls */}
        <div className="flex-1 overflow-y-auto custom-scrollbar px-8 pb-8 space-y-10">
          <ControlPanel
            a={a} setA={handleA}
            b={b} setB={handleB}
            fnId={fnId} setFnId={handleFn}
          />
          
          <ExamplesPanel
            onSelect={handleExample}
            currentA={a} currentB={b} currentFnId={fnId}
          />

          <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.04] space-y-3">
            <div className="flex items-center gap-2 text-white/30">
              <Info className="w-3 h-3" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Theorem Status</span>
            </div>
            <p className="text-[11px] text-white/40 leading-relaxed">
              Analyzing <span className="text-accent font-mono font-bold">T(n) = {a}T(n/{b}) + {fn.label}</span>. 
              {a < 1 ? ' Case invalid: a must be ≥ 1.' : b <= 1 ? ' Case invalid: b must be > 1.' : ' Ready for analysis.'}
            </p>
          </div>
        </div>
      </aside>

      {/* ─── MAIN AREA ─── */}
      <main className="flex-1 flex flex-col min-w-0 bg-background relative overflow-hidden">
        {/* Decorative Grid */}
        <div className="absolute inset-0 bg-grid-pattern bg-grid-40 opacity-[0.15] pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background pointer-events-none" />

        {/* Top bar */}
        <header className="shrink-0 px-10 py-8 flex justify-between items-center z-20">
          <div>
            <div className="flex items-center gap-3 mb-1">
               <span className="px-2 py-0.5 rounded bg-primary/20 text-primary text-[9px] font-black uppercase tracking-widest">Interactive</span>
               <h2 className="text-3xl font-black tracking-tight text-white">
                {viewMode === 'visualizer' ? 'Recurrence Explorer' : 'Complexity Code Lab'}
              </h2>
            </div>
            <p className="text-xs text-white/30 font-medium tracking-wide">
              {viewMode === 'visualizer' 
                ? 'Visualize how recursive branching and work distribution shape complexity.' 
                : 'Convert recurrences to code and analyze code for asymptotic behavior.'}
            </p>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={`${a}-${b}-${viewMode}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="glass-panel px-6 py-3.5 rounded-2xl flex flex-col items-end border-white/[0.08] shadow-xl"
            >
              <div className="label-micro mb-1.5 opacity-50">Critical Exponent</div>
              <div className="text-2xl font-mono font-black text-accent tracking-tight">
                log<sub className="text-[10px]">{b}</sub>({a}) ≈ {result.logBa.toFixed(2)}
              </div>
            </motion.div>
          </AnimatePresence>
        </header>

        {/* Content area */}
        <div className="flex-1 relative z-10 px-10 pb-8 min-h-0">
          <AnimatePresence mode="wait">
            {viewMode === 'visualizer' ? (
              <motion.div 
                key="visualizer"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="h-full flex gap-6 min-h-0"
              >
                {/* Tree visualization */}
                <div className="flex-[7] glass-panel rounded-3xl relative overflow-hidden flex items-center justify-center border-white/[0.08] shadow-2xl">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(99,102,241,0.08),transparent_70%)]" />
                  <RecursionTree
                    a={a} b={b} fnId={fnId}
                    revealedDominant={prediction ? result.dominant : null}
                  />
                </div>

                {/* Right panel */}
                <div className="flex-[5] flex flex-col gap-6 overflow-y-auto custom-scrollbar pr-2">
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
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
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
