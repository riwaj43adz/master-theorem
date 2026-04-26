import { fnOptions } from '../utils/masterTheorem';
import { motion } from 'framer-motion';
import clsx from 'clsx';

interface ControlPanelProps {
  a: number;
  setA: (val: number) => void;
  b: number;
  setB: (val: number) => void;
  fnId: string;
  setFnId: (val: string) => void;
}

export default function ControlPanel({ a, setA, b, setB, fnId, setFnId }: ControlPanelProps) {
  return (
    <div className="space-y-7">
      {/* Recurrence Display */}
      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/30 via-accent/20 to-primary/30 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-700" />
        <div className="relative glass-panel p-5 rounded-2xl overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
          <div className="label-micro mb-3 text-center">Current Recurrence</div>
          <div className="text-xl font-mono text-white flex items-center justify-center gap-1.5 flex-wrap">
            <span className="text-white/30 italic">T(n)</span>
            <span className="text-white/20">=</span>
            <span className="text-primary font-black">{a > 1 ? a : ''}</span>
            <span className="text-white/70">T(n/<span className="text-accent font-bold">{b}</span>)</span>
            <span className="text-white/20">+</span>
            <span
              className="text-root font-bold"
              dangerouslySetInnerHTML={{ __html: fnOptions.find(o => o.id === fnId)?.html || '' }}
            />
          </div>
        </div>
      </div>

      {/* a slider */}
      <div className="space-y-3">
        <div className="flex justify-between items-end">
          <div>
            <div className="label-micro mb-0.5">Subproblems</div>
            <div className="text-[10px] text-white/15 font-medium">branching factor <span className="text-primary/60 font-bold">a</span></div>
          </div>
          <motion.span
            key={a}
            initial={{ scale: 1.4, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="value-display text-primary"
          >
            {a}
          </motion.span>
        </div>
        <input
          type="range" min="1" max="10" step="1"
          value={a}
          onChange={e => setA(parseInt(e.target.value))}
        />
        <div className="flex justify-between text-[9px] text-white/10 font-mono">
          <span>1</span><span>10</span>
        </div>
      </div>

      {/* b slider */}
      <div className="space-y-3">
        <div className="flex justify-between items-end">
          <div>
            <div className="label-micro mb-0.5">Division</div>
            <div className="text-[10px] text-white/15 font-medium">reduction scale <span className="text-accent/60 font-bold">b</span></div>
          </div>
          <motion.span
            key={b}
            initial={{ scale: 1.4, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="value-display text-accent"
          >
            {b}
          </motion.span>
        </div>
        <input
          type="range" min="2" max="10" step="1"
          value={b}
          onChange={e => setB(parseInt(e.target.value))}
        />
        <div className="flex justify-between text-[9px] text-white/10 font-mono">
          <span>2</span><span>10</span>
        </div>
      </div>

      {/* f(n) selector */}
      <div className="space-y-3">
        <div className="label-micro">Driving Function f(n)</div>
        <div className="grid grid-cols-2 gap-2">
          {fnOptions.map(opt => (
            <button
              key={opt.id}
              onClick={() => setFnId(opt.id)}
              className={clsx(
                "px-3 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 border cursor-pointer",
                fnId === opt.id
                  ? "bg-root/15 border-root/40 text-root shadow-[0_0_20px_rgba(244,63,94,0.15)]"
                  : "bg-white/[0.02] border-white/[0.05] text-white/35 hover:bg-white/[0.06] hover:text-white/70"
              )}
              dangerouslySetInnerHTML={{ __html: opt.html }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
