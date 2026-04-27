import { motion } from 'framer-motion';
import { generateExpansionSteps } from '../utils/masterTheorem';
import type { FnOption } from '../utils/masterTheorem';

interface Props {
  a: number;
  b: number;
  fn: FnOption;
}

export default function StepExpansion({ a, b, fn }: Props) {
  const steps = generateExpansionSteps(a, b, fn, 4);

  return (
    <div className="glass-panel rounded-[32px] p-8 overflow-hidden">
      <div className="label-micro mb-6 text-slate-400">Recurrence Expansion</div>
      <div className="space-y-1">
        {steps.map((step, i) => (
          <motion.div
            key={`${a}-${b}-${fn.id}-${i}`}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1, duration: 0.3 }}
            className="flex items-center gap-4"
          >
            {/* Depth indicator */}
            <div className="w-6 text-right">
              <span className="text-[10px] font-mono text-slate-300 font-black">{i}</span>
            </div>

            {/* Connector */}
            <div className="flex flex-col items-center w-4">
              {i > 0 && <div className="w-0.5 h-3 bg-primary/10" />}
              <div className="w-2 h-2 rounded-full bg-primary/20 shrink-0 border border-primary/10" />
              {i < steps.length - 1 && <div className="w-0.5 h-3 bg-primary/10" />}
            </div>

            {/* Content */}
            <div className="flex items-baseline gap-3 py-2">
              {i > 0 && <span className="text-slate-200 text-xs font-black">→</span>}
              <span
                className="text-[13px] font-mono text-slate-700 font-bold"
                dangerouslySetInnerHTML={{ __html: step.termHtml }}
              />
              {i > 0 && (
                <span className="text-[11px] font-mono text-root font-bold opacity-70">
                  + <span dangerouslySetInnerHTML={{ __html: step.costTermHtml }} />
                </span>
              )}
            </div>
          </motion.div>
        ))}

        {/* Base case indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: steps.length * 0.1 }}
          className="flex items-center gap-4 pt-2"
        >
          <div className="w-6" />
          <div className="w-4 flex justify-center">
             <div className="w-0.5 h-3 bg-leaves/10 mb-1" />
          </div>
          <div className="flex items-center gap-2">
             <div className="w-2 h-2 rounded-full bg-leaves/20 border border-leaves/10" />
             <span className="text-[11px] font-mono text-leaves font-black italic opacity-60">
               ⋯ base case
             </span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
