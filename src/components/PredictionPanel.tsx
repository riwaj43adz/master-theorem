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
    <div className="glass-panel rounded-[32px] overflow-hidden">
      <AnimatePresence mode="wait">
        {!userPrediction ? (
          <motion.div
            key="question"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
            className="p-8"
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="p-1.5 bg-primary/10 rounded-lg">
                <HelpCircle className="w-4 h-4 text-primary" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-primary/70">Predict the complexity</span>
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-2 tracking-tight">
              Which part dominates the cost?
            </h3>
            <p className="text-[13px] text-slate-500 font-medium mb-8 leading-relaxed">
              Think about how a subproblems and f(n) interact before revealing the answer.
            </p>
            <div className="space-y-3">
              {options.map(({ type, icon, desc }) => (
                <motion.button
                  key={type}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onPredict(type)}
                  className={clsx(
                    "w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 border-2 text-left cursor-pointer group",
                    type === 'Root' && "border-root/10 bg-root/[0.02] hover:border-root/40 hover:bg-root/[0.05]",
                    type === 'Middle' && "border-middle/10 bg-middle/[0.02] hover:border-middle/40 hover:bg-middle/[0.05]",
                    type === 'Leaves' && "border-leaves/10 bg-leaves/[0.02] hover:border-leaves/40 hover:bg-leaves/[0.05]"
                  )}
                >
                  <span className="text-2xl">{icon}</span>
                  <div>
                    <div className={clsx(
                      "text-[11px] font-black uppercase tracking-widest transition-colors mb-0.5",
                      type === 'Root' && "text-root",
                      type === 'Middle' && "text-middle",
                      type === 'Leaves' && "text-leaves"
                    )}>
                      {type}
                    </div>
                    <div className="text-[11px] text-slate-400 font-bold">{desc}</div>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, type: 'spring', stiffness: 200 }}
            className="p-8 relative"
          >
            {/* Verdict */}
            <div className="flex items-center gap-4 mb-8 relative">
              <div className={clsx(
                "p-3 rounded-2xl shrink-0 shadow-lg",
                isCorrect ? "bg-leaves text-white shadow-leaves/20" : "bg-root text-white shadow-root/20"
              )}>
                {isCorrect
                  ? <CheckCircle2 className="w-6 h-6" />
                  : <XCircle className="w-6 h-6" />
                }
              </div>
              <div>
                <h3 className={clsx(
                  "text-2xl font-black tracking-tight leading-none mb-1.5",
                  isCorrect ? "text-leaves" : "text-root"
                )}>
                  {isCorrect ? 'Correct!' : 'Not Quite'}
                </h3>
                <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest">
                  Analysis Complete — <span className="text-slate-600">Case {result.caseNum}</span>
                </p>
              </div>
            </div>

            <div className="space-y-4 mb-8">
              {/* Comparison */}
              <div className="bg-slate-50 border border-slate-100 p-5 rounded-2xl">
                <div className="label-micro mb-2">Math Comparison</div>
                <div
                  className="text-base font-mono text-slate-700 font-bold"
                  dangerouslySetInnerHTML={{ __html: result.comparison }}
                />
              </div>

              {/* Complexity */}
              <div className="bg-primary/[0.03] border border-primary/10 p-5 rounded-2xl">
                <div className="label-micro mb-2 text-primary">Final Complexity</div>
                <div
                  className="text-2xl font-mono font-black text-slate-900"
                  dangerouslySetInnerHTML={{ __html: result.complexityHtml }}
                />
              </div>
            </div>

            {/* Explanation */}
            <p className="text-[13px] text-slate-500 font-medium leading-relaxed mb-8 p-1">
              {result.explanation}
            </p>

            {/* Reset */}
            <button
              onClick={onReset}
              className="w-full py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest bg-slate-100 hover:bg-slate-200 text-slate-600 transition-all flex items-center justify-center gap-3 cursor-pointer border border-slate-200"
            >
              <RotateCcw className="w-4 h-4" />
              Reset Analysis
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
