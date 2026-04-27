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
    <div className="space-y-12">
      {/* a slider */}
      <div className="space-y-5">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-xl">
              <Layers className="w-4 h-4 text-primary" />
            </div>
            <div>
              <div className="label-micro text-slate-400">Branching</div>
              <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-0.5">Factor <span className="text-primary/80">a</span></div>
            </div>
          </div>
          <motion.span
            key={a}
            initial={{ scale: 1.2, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-3xl font-mono font-black text-slate-900 tracking-tighter"
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
          <div className="flex justify-between text-[10px] text-slate-300 font-black mt-3">
            <span>1</span><span>10</span>
          </div>
        </div>
      </div>

      {/* b slider */}
      <div className="space-y-5">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-accent/10 rounded-xl">
              <Divide className="w-4 h-4 text-accent" />
            </div>
            <div>
              <div className="label-micro text-slate-400">Reduction</div>
              <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-0.5">Scale <span className="text-accent/80">b</span></div>
            </div>
          </div>
          <motion.span
            key={b}
            initial={{ scale: 1.2, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-3xl font-mono font-black text-slate-900 tracking-tighter"
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
          <div className="flex justify-between text-[10px] text-slate-300 font-black mt-3">
            <span>2</span><span>10</span>
          </div>
        </div>
      </div>

      {/* f(n) selector */}
      <div className="space-y-5">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-root/10 rounded-xl">
            <Activity className="w-4 h-4 text-root" />
          </div>
          <div>
            <div className="label-micro text-slate-400">Driving Cost</div>
            <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-0.5">Function <span className="text-root/80">f(n)</span></div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {fnOptions.map(opt => (
            <button
              key={opt.id}
              onClick={() => setFnId(opt.id)}
              className={clsx(
                "px-3 py-4 rounded-2xl text-[12px] font-black tracking-tight transition-all duration-300 border cursor-pointer flex flex-col items-center justify-center gap-1",
                fnId === opt.id
                  ? "bg-slate-900 border-slate-900 text-white shadow-xl shadow-slate-200"
                  : "bg-white border-slate-200 text-slate-500 hover:border-slate-300 hover:bg-slate-50 shadow-sm"
              )}
            >
              <div dangerouslySetInnerHTML={{ __html: opt.html }} />
            </button>
          ))}
        </div>
      </div>

      {/* Recurrence Summary Card */}
      <div className="pt-6">
        <div className="p-5 rounded-3xl bg-slate-50 border border-slate-100 flex items-center gap-5 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center shrink-0 shadow-sm">
             <Box className="w-6 h-6 text-slate-300" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Active Model</p>
            <p className="text-sm font-mono text-slate-800 font-bold truncate">
              T(n) = {a}T(n/{b}) + {fnOptions.find(o => o.id === fnId)?.label}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
