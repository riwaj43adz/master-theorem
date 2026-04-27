import { fnOptions } from '../utils/masterTheorem';
import { motion } from 'framer-motion';
import { Layers, Divide, Activity, Box } from 'lucide-react';
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
    <div className="space-y-10">
      {/* a slider */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-primary/10 rounded-lg">
              <Layers className="w-3.5 h-3.5 text-primary" />
            </div>
            <div>
              <div className="label-micro text-white/50">Branching</div>
              <div className="text-[10px] text-white/20 font-bold uppercase tracking-widest mt-0.5">Factor <span className="text-primary/60">a</span></div>
            </div>
          </div>
          <motion.span
            key={a}
            initial={{ scale: 1.2, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-2xl font-mono font-black text-primary tracking-tighter"
          >
            {a}
          </motion.span>
        </div>
        <div className="px-1">
          <input
            type="range" min="1" max="10" step="1"
            value={a}
            onChange={e => setA(parseInt(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-[9px] text-white/10 font-black mt-2">
            <span>1</span><span>10</span>
          </div>
        </div>
      </div>

      {/* b slider */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-accent/10 rounded-lg">
              <Divide className="w-3.5 h-3.5 text-accent" />
            </div>
            <div>
              <div className="label-micro text-white/50">Reduction</div>
              <div className="text-[10px] text-white/20 font-bold uppercase tracking-widest mt-0.5">Scale <span className="text-accent/60">b</span></div>
            </div>
          </div>
          <motion.span
            key={b}
            initial={{ scale: 1.2, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-2xl font-mono font-black text-accent tracking-tighter"
          >
            {b}
          </motion.span>
        </div>
        <div className="px-1">
          <input
            type="range" min="2" max="10" step="1"
            value={b}
            onChange={e => setB(parseInt(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-[9px] text-white/10 font-black mt-2">
            <span>2</span><span>10</span>
          </div>
        </div>
      </div>

      {/* f(n) selector */}
      <div className="space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 bg-root/10 rounded-lg">
            <Activity className="w-3.5 h-3.5 text-root" />
          </div>
          <div>
            <div className="label-micro text-white/50">Driving Cost</div>
            <div className="text-[10px] text-white/20 font-bold uppercase tracking-widest mt-0.5">Function <span className="text-root/60">f(n)</span></div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {fnOptions.map(opt => (
            <button
              key={opt.id}
              onClick={() => setFnId(opt.id)}
              className={clsx(
                "px-3 py-3 rounded-xl text-[11px] font-black tracking-tight transition-all duration-300 border cursor-pointer flex flex-col items-center justify-center gap-1",
                fnId === opt.id
                  ? "bg-root/10 border-root/30 text-root shadow-lg shadow-root/5"
                  : "bg-white/[0.02] border-white/[0.04] text-white/30 hover:bg-white/[0.05] hover:text-white/60"
              )}
            >
              <div dangerouslySetInnerHTML={{ __html: opt.html }} />
            </button>
          ))}
        </div>
      </div>

      {/* Recurrence Summary Card */}
      <div className="pt-4">
        <div className="p-4 rounded-2xl bg-gradient-to-br from-white/[0.03] to-transparent border border-white/[0.06] flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/[0.05] flex items-center justify-center shrink-0">
             <Box className="w-5 h-5 text-white/20" />
          </div>
          <div className="min-w-0">
            <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.15em] mb-1">Equation</p>
            <p className="text-sm font-mono text-white/80 truncate">
              T(n) = {a}T(n/{b}) + {fnOptions.find(o => o.id === fnId)?.label}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
