import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ControlPanel from './components/ControlPanel';
import ExamplesPanel from './components/ExamplesPanel';
import RecursionTree from './components/RecursionTree';
import PredictionPanel from './components/PredictionPanel';
import GrowthChart from './components/GrowthChart';
import StepExpansion from './components/StepExpansion';
import ResultsPanel from './components/ResultsPanel';
import { getMasterTheoremCase, fnOptions } from './utils/masterTheorem';
import type { DominantPart } from './utils/masterTheorem';
import { Zap } from 'lucide-react';

function App() {
  const [a, setA] = useState(2);
  const [b, setB] = useState(2);
  const [fnId, setFnId] = useState('n');
  const [prediction, setPrediction] = useState<DominantPart | null>(null);

  const fn = useMemo(() => fnOptions.find(o => o.id === fnId) || fnOptions[2], [fnId]);
  const result = useMemo(() => getMasterTheoremCase(a, b, fn), [a, b, fn]);

  // Reset prediction when params change
  const handleA = (v: number) => { setA(v); setPrediction(null); };
  const handleB = (v: number) => { setB(v); setPrediction(null); };
  const handleFn = (v: string) => { setFnId(v); setPrediction(null); };
  const handleExample = (na: number, nb: number, nf: string) => {
    setA(na); setB(nb); setFnId(nf); setPrediction(null);
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      {/* ─── LEFT SIDEBAR ─── */}
      <aside className="w-[320px] shrink-0 bg-black/50 backdrop-blur-2xl border-r border-white/[0.06] flex flex-col overflow-hidden z-20">
        {/* Brand */}
        <div className="p-6 pb-4 flex items-center gap-3 shrink-0">
          <div className="p-2 bg-primary/15 rounded-lg">
            <Zap className="text-primary w-4 h-4" />
          </div>
          <div>
            <h1 className="text-sm font-black tracking-tight text-white uppercase">
              Master Theorem
            </h1>
            <p className="text-[9px] text-white/20 font-medium uppercase tracking-widest">Playground</p>
          </div>
        </div>

        {/* Scrollable controls */}
        <div className="flex-1 overflow-y-auto custom-scrollbar px-6 pb-6 space-y-8">
          <ControlPanel
            a={a} setA={handleA}
            b={b} setB={handleB}
            fnId={fnId} setFnId={handleFn}
          />
          <div className="h-px bg-white/[0.04]" />
          <ExamplesPanel
            onSelect={handleExample}
            currentA={a} currentB={b} currentFnId={fnId}
          />
        </div>
      </aside>

      {/* ─── MAIN AREA ─── */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* Top bar */}
        <header className="shrink-0 px-8 py-5 flex justify-between items-start z-10">
          <div>
            <h2 className="text-3xl font-black tracking-tighter text-white">
              Recurrence <span className="text-primary">Explorer</span>
            </h2>
            <p className="text-xs text-white/25 mt-1 max-w-lg font-medium">
              Visualize how branching, division, and driving cost shape computational complexity.
            </p>
          </div>
          <div className="glass-panel px-5 py-3 rounded-xl">
            <div className="label-micro mb-1">Critical Exponent</div>
            <AnimatePresence mode="wait">
              <motion.div
                key={`${a}-${b}`}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="text-xl font-mono font-black text-accent"
              >
                log<sub className="text-xs">{b}</sub>({a}) ≈ {result.logBa.toFixed(2)}
              </motion.div>
            </AnimatePresence>
          </div>
        </header>

        {/* Content area — flex row */}
        <div className="flex-1 flex gap-5 px-8 pb-6 min-h-0">
          {/* Tree visualization - center stage */}
          <div className="flex-[7] glass-panel rounded-2xl relative overflow-hidden flex items-center justify-center min-h-0 min-w-0">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(99,102,241,0.04),transparent_70%)]" />
            <RecursionTree
              a={a} b={b} fnId={fnId}
              revealedDominant={prediction ? result.dominant : null}
            />
          </div>

          {/* Right panel - independently scrollable */}
          <div className="flex-[5] min-h-0 min-w-0 overflow-y-auto custom-scrollbar pr-1">
            <div className="flex flex-col gap-4">
              {/* Prediction Panel */}
              <div className="shrink-0">
                <PredictionPanel
                  result={result}
                  userPrediction={prediction}
                  onPredict={setPrediction}
                  onReset={() => setPrediction(null)}
                />
              </div>

              {/* Growth chart */}
              <div className="shrink-0">
                <GrowthChart a={a} b={b} fn={fn} result={result} />
              </div>

              {/* Step Expansion */}
              <div className="shrink-0">
                <StepExpansion a={a} b={b} fn={fn} />
              </div>

              {/* Results / Intuition */}
              <div className="shrink-0">
                <ResultsPanel result={result} revealed={!!prediction} />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
