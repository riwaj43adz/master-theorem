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
    1: { bg: 'bg-leaves/10', border: 'border-leaves/30', text: 'text-leaves', label: 'Leaf-Heavy' },
    2: { bg: 'bg-middle/10', border: 'border-middle/30', text: 'text-middle', label: 'Balanced' },
    3: { bg: 'bg-root/10', border: 'border-root/30', text: 'text-root', label: 'Root-Heavy' },
  };
  const c = caseColors[result.caseNum];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        className="glass-panel rounded-3xl p-6"
      >
        <div className="label-micro mb-4 text-slate-400">Theoretical Intuition</div>
        <div className="flex items-center gap-3 mb-4">
          <div className={clsx("px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest border", c.bg, c.border, c.text)}>
            Case {result.caseNum} — {c.label}
          </div>
        </div>
        <p className="text-sm text-slate-600 font-medium leading-relaxed">
          {result.caseNum === 1 && "The recursive work at the leaves grows faster than the work at the root. The tree gets heavier as we go deeper."}
          {result.caseNum === 2 && "The work is perfectly balanced across all levels of the tree. Every level contributes equally."}
          {result.caseNum === 3 && "The work at the root dominates all subsequent recursive steps. The top of the tree does the heavy lifting."}
        </p>
        <div className="mt-5 p-4 rounded-2xl bg-slate-50 border border-slate-100">
          <span className="text-[11px] text-slate-500 font-medium leading-relaxed">
            By comparing f(n) to n<sup>log<sub>b</sub>a</sup>, we determine where computational cost concentrates.
          </span>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
