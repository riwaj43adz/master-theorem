import { useMemo } from 'react';
import { motion } from 'framer-motion';
import type { MasterTheoremResult, FnOption } from '../utils/masterTheorem';

interface Props {
  a: number;
  b: number;
  fn: FnOption;
  result: MasterTheoremResult;
}

export default function GrowthChart({ a, b, fn, result }: Props) {
  const pts = 30;
  const nVals = Array.from({ length: pts }, (_, i) => (i + 1) * 2);

  const { fPts, gPts, maxY } = useMemo(() => {
    const fD = nVals.map(n => {
      const lg = Math.max(Math.log2(n), 0.01);
      return Math.pow(n, fn.d) * Math.pow(lg, fn.k);
    });
    const gD = nVals.map(n => Math.pow(n, result.logBa));
    const mx = Math.max(...fD, ...gD, 1);
    const W = 300, H = 140;
    const toP = (arr: number[]) => arr.map((v, i) => ({
      x: (i / (pts - 1)) * W,
      y: H - (v / mx) * (H - 10),
    }));
    return { fPts: toP(fD), gPts: toP(gD), maxY: mx };
  }, [a, b, fn, result]);

  const path = (p: { x: number; y: number }[]) =>
    `M ${p.map(v => `${v.x.toFixed(1)},${v.y.toFixed(1)}`).join(' L ')}`;

  const balanced = result.caseNum === 2 && fn.k === 0;

  return (
    <div className="glass-panel rounded-[32px] p-6 overflow-hidden">
      <div className="flex justify-between items-center mb-6">
        <div className="label-micro text-slate-400">Growth Comparison</div>
        <div className="flex gap-5 text-[10px] font-black uppercase tracking-widest">
          <span className="flex items-center gap-2">
            <span className="w-2.5 h-1 bg-root rounded-full inline-block" /> <span className="text-root">f(n)</span>
          </span>
          <span className="flex items-center gap-2">
            <span className="w-2.5 h-1 bg-leaves rounded-full inline-block" /> <span className="text-leaves">n<sup>crit</sup></span>
          </span>
        </div>
      </div>

      <div className="relative h-40 w-full mb-6">
        <svg viewBox="0 0 300 140" className="w-full h-full overflow-visible" preserveAspectRatio="none">
          {[0, 0.25, 0.5, 0.75, 1].map(p => (
            <line key={p} x1="0" y1={140 * p} x2="300" y2={140 * p}
              stroke="#e2e8f0" strokeOpacity="1" strokeDasharray="2 4" />
          ))}
          <motion.path d={path(fPts)} fill="none" stroke="#e11d48"
            strokeWidth={balanced ? 4 : 3} strokeLinecap="round" strokeLinejoin="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1 }}
          />
          <motion.path d={path(gPts)} fill="none" stroke="#059669"
            strokeWidth={3} strokeLinecap="round" strokeLinejoin="round"
            strokeDasharray={balanced ? '4 6' : 'none'}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1, delay: 0.15 }}
          />
        </svg>
        {balanced && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full border border-slate-200 text-[10px] font-black text-middle uppercase tracking-widest shadow-lg">
              Growth Match
            </div>
          </div>
        )}
      </div>

      <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl">
        <div className={`text-[11px] font-black text-center uppercase tracking-widest transition-all duration-500 ${
          result.dominant === 'Root' ? 'text-root' :
          result.dominant === 'Leaves' ? 'text-leaves' :
          'text-middle'
        }`}>
          {result.dominant === 'Root' && 'f(n) Grows Faster'}
          {result.dominant === 'Leaves' && 'Recursive Density Wins'}
          {result.dominant === 'Middle' && 'Perfectly Balanced'}
        </div>
      </div>
    </div>
  );
}
