import { motion, AnimatePresence } from 'framer-motion';
import { examplePresets, fnOptions } from '../utils/masterTheorem';
import { ChevronRight, Sparkles } from 'lucide-react';
import clsx from 'clsx';

interface ExamplesPanelProps {
  onSelect: (a: number, b: number, fnId: string) => void;
  currentA: number;
  currentB: number;
  currentFnId: string;
}

export default function ExamplesPanel({ onSelect, currentA, currentB, currentFnId }: ExamplesPanelProps) {
  const isActive = (a: number, b: number, fnId: string) =>
    currentA === a && currentB === b && currentFnId === fnId;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-1">
        <Sparkles className="w-3.5 h-3.5 text-accent/50" />
        <span className="label-micro">Algorithm Templates</span>
      </div>
      <div className="space-y-2">
        {examplePresets.map((ex) => {
          const active = isActive(ex.a, ex.b, ex.fnId);
          return (
            <motion.button
              key={ex.name}
              onClick={() => onSelect(ex.a, ex.b, ex.fnId)}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
              className={clsx(
                "w-full group flex items-center justify-between p-3.5 rounded-xl transition-all duration-300 text-left cursor-pointer",
                active
                  ? "bg-primary/10 border border-primary/30"
                  : "bg-white/[0.02] border border-transparent hover:bg-white/[0.05] hover:border-white/[0.08]"
              )}
            >
              <div className="min-w-0">
                <div className={clsx(
                  "text-[11px] font-black uppercase tracking-wider transition-colors",
                  active ? "text-primary" : "text-white/60 group-hover:text-white"
                )}>
                  {ex.name}
                </div>
                <div className="text-[10px] font-mono text-white/20 mt-0.5 truncate">
                  {ex.description}
                </div>
              </div>
              <ChevronRight className={clsx(
                "w-3.5 h-3.5 shrink-0 transition-all",
                active ? "text-primary" : "text-white/10 group-hover:text-white/40"
              )} />
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
