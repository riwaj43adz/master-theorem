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
    <div className="glass-panel rounded-2xl p-5 overflow-hidden">
      <div className="flex justify-between items-center mb-4">
        <div className="label-micro">Growth Comparison</div>
        <div className="flex gap-4 text-[9px] font-bold uppercase tracking-wider">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-0.5 bg-root rounded-full inline-block" /> <span className="text-root/70">f(n)</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-0.5 bg-leaves rounded-full inline-block" /> <span className="text-leaves/70">n<sup>crit</sup></span>
          </span>
        </div>
      </div>

      <div className="relative h-40 w-full">
        <svg viewBox="0 0 300 140" className="w-full h-full overflow-visible" preserveAspectRatio="none">
          {[0, 0.25, 0.5, 0.75, 1].map(p => (
            <line key={p} x1="0" y1={140 * p} x2="300" y2={140 * p}
              stroke="white" strokeOpacity="0.03" strokeDasharray="2 4" />
          ))}
          <motion.path d={path(fPts)} fill="none" stroke="#f43f5e"
            strokeWidth={balanced ? 3.5 : 2.5} strokeLinecap="round" strokeLinejoin="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1 }} className="glow-root"
          />
          <motion.path d={path(gPts)} fill="none" stroke="#10b981"
            strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"
            strokeDasharray={balanced ? '4 6' : 'none'}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1, delay: 0.15 }} className="glow-leaves"
          />
        </svg>
        {balanced && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full border border-white/10 text-[9px] font-bold text-middle/70 uppercase tracking-widest">
              Growth Match
            </div>
          </div>
        )}
      </div>

      <div className="mt-3">
        <div className={`text-[10px] font-bold p-2.5 rounded-lg border text-center uppercase tracking-wider transition-all duration-500 ${
          result.dominant === 'Root' ? 'bg-root/10 border-root/20 text-root' :
          result.dominant === 'Leaves' ? 'bg-leaves/10 border-leaves/20 text-leaves' :
          'bg-middle/10 border-middle/20 text-middle'
        }`}>
          {result.dominant === 'Root' && 'f(n) Grows Faster'}
          {result.dominant === 'Leaves' && 'Recursive Density Wins'}
          {result.dominant === 'Middle' && 'Perfectly Balanced'}
        </div>
      </div>
    </div>
  );
}
