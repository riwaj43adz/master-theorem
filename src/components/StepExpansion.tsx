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
    <div className="glass-panel rounded-2xl p-5 overflow-hidden">
      <div className="label-micro mb-4">Recurrence Expansion</div>
      <div className="space-y-1">
        {steps.map((step, i) => (
          <motion.div
            key={`${a}-${b}-${fn.id}-${i}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.12, duration: 0.4 }}
            className="flex items-center gap-3"
          >
            {/* Depth indicator */}
            <div className="w-5 text-right">
              <span className="text-[9px] font-mono text-white/15">{i}</span>
            </div>

            {/* Connector */}
            <div className="flex flex-col items-center w-3">
              {i > 0 && <div className="w-px h-2 bg-primary/20" />}
              <div className="w-1.5 h-1.5 rounded-full bg-primary/40 shrink-0" />
              {i < steps.length - 1 && <div className="w-px h-2 bg-primary/20" />}
            </div>

            {/* Content */}
            <div className="flex items-baseline gap-2 py-1.5">
              {i > 0 && <span className="text-white/15 text-xs">→</span>}
              <span
                className="text-sm font-mono text-white/70"
                dangerouslySetInnerHTML={{ __html: step.termHtml }}
              />
              {i > 0 && (
                <span className="text-[10px] font-mono text-root/50">
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
          transition={{ delay: steps.length * 0.12 }}
          className="flex items-center gap-3 pt-1"
        >
          <div className="w-5" />
          <div className="w-3 flex justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-leaves/40" />
          </div>
          <span className="text-[10px] font-mono text-leaves/50 italic">
            ⋯ until base case
          </span>
        </motion.div>
      </div>
    </div>
  );
}
