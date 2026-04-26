import { motion, AnimatePresence } from 'framer-motion';
import type { MasterTheoremResult } from '../utils/masterTheorem';
import clsx from 'clsx';

interface Props {
  result: MasterTheoremResult;
  revealed: boolean;
}

export default function ResultsPanel({ result, revealed }: Props) {
  if (!revealed) return null;

  const caseColors = {
    1: { bg: 'bg-leaves/5', border: 'border-leaves/20', text: 'text-leaves', label: 'Leaf-Heavy' },
    2: { bg: 'bg-middle/5', border: 'border-middle/20', text: 'text-middle', label: 'Balanced' },
    3: { bg: 'bg-root/5', border: 'border-root/20', text: 'text-root', label: 'Root-Heavy' },
  };
  const c = caseColors[result.caseNum];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        className="glass-panel rounded-2xl p-5"
      >
        <div className="label-micro mb-3">Theoretical Intuition</div>
        <div className="flex items-center gap-3 mb-3">
          <div className={clsx("px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider border", c.bg, c.border, c.text)}>
            Case {result.caseNum} — {c.label}
          </div>
        </div>
        <p className="text-sm text-white/50 leading-relaxed">
          {result.caseNum === 1 && "The recursive work at the leaves grows faster than the work at the root. The tree gets heavier as we go deeper."}
          {result.caseNum === 2 && "The work is perfectly balanced across all levels of the tree. Every level contributes equally."}
          {result.caseNum === 3 && "The work at the root dominates all subsequent recursive steps. The top of the tree does the heavy lifting."}
        </p>
        <div className="mt-3 p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]">
          <span className="text-[10px] text-white/20 font-medium">
            By comparing f(n) to n<sup>log<sub>b</sub>a</sup>, we determine where computational cost concentrates.
          </span>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
