import { motion, AnimatePresence } from 'framer-motion';
import type { MasterTheoremResult, DominantPart } from '../utils/masterTheorem';
import { CheckCircle2, XCircle, RotateCcw, HelpCircle } from 'lucide-react';
import clsx from 'clsx';

interface PredictionPanelProps {
  result: MasterTheoremResult;
  userPrediction: DominantPart | null;
  onPredict: (prediction: DominantPart) => void;
  onReset: () => void;
}

const options: { type: DominantPart; icon: string; desc: string }[] = [
  { type: 'Root', icon: '🔴', desc: 'f(n) dominates' },
  { type: 'Middle', icon: '🟡', desc: 'Balanced across levels' },
  { type: 'Leaves', icon: '🟢', desc: 'Recursion dominates' },
];

export default function PredictionPanel({ result, userPrediction, onPredict, onReset }: PredictionPanelProps) {
  const isCorrect = userPrediction === result.dominant;

  return (
    <div className="glass-panel rounded-2xl">
      <AnimatePresence mode="wait">
        {!userPrediction ? (
          <motion.div
            key="question"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
            className="p-5"
          >
            <div className="flex items-center gap-2 mb-4">
              <HelpCircle className="w-4 h-4 text-primary/60" />
              <span className="label-micro text-primary/80">Predict First</span>
            </div>
            <h3 className="text-base font-black text-white mb-1 tracking-tight">
              Which part dominates the cost?
            </h3>
            <p className="text-[11px] text-white/25 mb-5">
              Think about how a={result.logBa > 0 ? 'a' : ''} subproblems and f(n) interact before revealing the answer.
            </p>
            <div className="space-y-2">
              {options.map(({ type, icon, desc }) => (
                <motion.button
                  key={type}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => onPredict(type)}
                  className={clsx(
                    "w-full flex items-center gap-3 p-3.5 rounded-xl transition-all duration-300 border-2 text-left cursor-pointer group",
                    type === 'Root' && "border-root/20 hover:border-root/50 hover:bg-root/10",
                    type === 'Middle' && "border-middle/20 hover:border-middle/50 hover:bg-middle/10",
                    type === 'Leaves' && "border-leaves/20 hover:border-leaves/50 hover:bg-leaves/10"
                  )}
                >
                  <span className="text-lg">{icon}</span>
                  <div>
                    <div className={clsx(
                      "text-[11px] font-black uppercase tracking-wider transition-colors",
                      type === 'Root' && "text-root/70 group-hover:text-root",
                      type === 'Middle' && "text-middle/70 group-hover:text-middle",
                      type === 'Leaves' && "text-leaves/70 group-hover:text-leaves"
                    )}>
                      {type}
                    </div>
                    <div className="text-[10px] text-white/20 mt-0.5">{desc}</div>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, type: 'spring', stiffness: 200 }}
            className="p-5 relative"
          >
            {/* Background glow */}
            <div className={clsx(
              "absolute -top-16 -right-16 w-40 h-40 rounded-full blur-[80px] opacity-15",
              isCorrect ? "bg-leaves" : "bg-root"
            )} />

            {/* Verdict */}
            <div className="flex items-center gap-3 mb-4 relative">
              <div className={clsx(
                "p-2 rounded-xl shrink-0",
                isCorrect ? "bg-leaves/10 text-leaves" : "bg-root/10 text-root"
              )}>
                {isCorrect
                  ? <CheckCircle2 className="w-5 h-5" />
                  : <XCircle className="w-5 h-5" />
                }
              </div>
              <div>
                <h3 className={clsx(
                  "text-lg font-black tracking-tight",
                  isCorrect ? "text-leaves" : "text-root"
                )}>
                  {isCorrect ? 'Correct!' : 'Not Quite'}
                </h3>
                <p className="text-[10px] text-white/30">
                  Master Theorem — <span className="font-bold">Case {result.caseNum}</span>
                </p>
              </div>
            </div>

            {/* Comparison */}
            <div className="glass-panel-alt p-3.5 rounded-xl mb-3">
              <div className="label-micro mb-1.5">Comparison</div>
              <div
                className="text-sm font-mono text-white/80"
                dangerouslySetInnerHTML={{ __html: result.comparison }}
              />
            </div>

            {/* Complexity */}
            <div className="glass-panel-alt p-3.5 rounded-xl mb-3">
              <div className="label-micro mb-1.5">Time Complexity</div>
              <div
                className="text-xl font-mono font-black text-white"
                dangerouslySetInnerHTML={{ __html: result.complexityHtml }}
              />
            </div>

            {/* Explanation */}
            <p className="text-[11px] text-white/40 leading-relaxed mb-4">
              {result.explanation}
            </p>

            {/* Reset */}
            <button
              onClick={onReset}
              className="w-full py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] text-white/50 hover:text-white transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              Try Again
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
