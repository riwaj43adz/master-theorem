import { useMemo } from 'react';
import { hierarchy, tree } from 'd3-hierarchy';
import { motion } from 'framer-motion';
import { fnOptions } from '../utils/masterTheorem';
import type { FnOption } from '../utils/masterTheorem';

interface Props {
  a: number;
  b: number;
  fnId: string;
  revealedDominant: 'Root' | 'Middle' | 'Leaves' | null;
}

export default function RecursionTree({ a, b, fnId, revealedDominant }: Props) {
  const fn = useMemo(() => fnOptions.find(o => o.id === fnId) as FnOption, [fnId]);

  const { nodes, links, levels, maxDepth, svgW, svgH } = useMemo(() => {
    const depth = a >= 6 ? 2 : a >= 4 ? 3 : 4;
    const build = (d: number): any => {
      if (d >= depth) return { name: 'base', children: [] };
      return { name: `L${d}`, children: Array.from({ length: a }, () => build(d + 1)) };
    };
    const root = hierarchy(build(0));
    const w = Math.min(1400, Math.max(600, a * 180));
    const h = depth * 120;
    tree().size([w, h])(root);
    const lm = new Map<number, any[]>();
    root.descendants().forEach(n => {
      if (!lm.has(n.depth)) lm.set(n.depth, []);
      lm.get(n.depth)!.push(n);
    });
    return { nodes: root.descendants(), links: root.links(), levels: lm, maxDepth: depth, svgW: w, svgH: h };
  }, [a, b]);

  const nodeColor = (d: number) => {
    if (!revealedDominant) return 'rgba(255,255,255,0.12)';
    if (revealedDominant === 'Root' && d === 0) return '#f43f5e';
    if (revealedDominant === 'Leaves' && d === maxDepth) return '#10b981';
    if (revealedDominant === 'Middle') return '#f59e0b';
    return 'rgba(255,255,255,0.06)';
  };

  const isHigh = (d: number) => revealedDominant && (
    (revealedDominant === 'Root' && d === 0) ||
    (revealedDominant === 'Leaves' && d === maxDepth) ||
    revealedDominant === 'Middle'
  );

  const linkColor = (td: number) => {
    if (!revealedDominant) return '#ffffff';
    if (revealedDominant === 'Root' && td <= 1) return '#f43f5e';
    if (revealedDominant === 'Leaves' && td === maxDepth) return '#10b981';
    if (revealedDominant === 'Middle') return '#f59e0b';
    return '#ffffff';
  };

  const linkOp = (td: number) => {
    if (!revealedDominant) return 0.15;
    if (revealedDominant === 'Root' && td <= 1) return 0.6;
    if (revealedDominant === 'Leaves' && td === maxDepth) return 0.6;
    if (revealedDominant === 'Middle') return 0.4;
    return 0.06;
  };

  return (
    <div className="w-full h-full flex items-center justify-center">
      <svg viewBox={`-60 -50 ${svgW + 160} ${svgH + 100}`} className="w-full h-full">
        <defs>
          <radialGradient id="gr"><stop offset="0%" stopColor="#f43f5e" stopOpacity="0.25"/><stop offset="100%" stopColor="#f43f5e" stopOpacity="0"/></radialGradient>
          <radialGradient id="gl"><stop offset="0%" stopColor="#10b981" stopOpacity="0.25"/><stop offset="100%" stopColor="#10b981" stopOpacity="0"/></radialGradient>
          <radialGradient id="gm"><stop offset="0%" stopColor="#f59e0b" stopOpacity="0.25"/><stop offset="100%" stopColor="#f59e0b" stopOpacity="0"/></radialGradient>
        </defs>

        {links.map((l: any, i: number) => (
          <motion.line key={`l-${a}-${b}-${i}`}
            x1={l.source.x} y1={l.source.y} x2={l.target.x} y2={l.target.y}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: linkOp(l.target.depth), stroke: linkColor(l.target.depth) }}
            transition={{ duration: 0.6, delay: l.target.depth * 0.08 }}
            strokeWidth={2}
          />
        ))}

        {nodes.map((n: any, i: number) => {
          const leaf = n.depth === maxDepth;
          const r = leaf ? 8 : n.depth === 0 ? 18 : 12;
          const hi = isHigh(n.depth);
          const c = nodeColor(n.depth);
          return (
            <g key={`n-${a}-${b}-${i}`}>
              {hi && (
                <motion.circle cx={n.x} cy={n.y} r={r * 2.5}
                  fill={revealedDominant === 'Root' ? 'url(#gr)' : revealedDominant === 'Leaves' ? 'url(#gl)' : 'url(#gm)'}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}
              <motion.circle cx={n.x} cy={n.y} r={r}
                fill="#0d0d14" stroke={c} strokeWidth={hi ? 2.5 : 1.5}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4, delay: n.depth * 0.08, type: 'spring', stiffness: 300 }}
              />
            </g>
          );
        })}

        {Array.from(levels.entries()).map(([depth, lns]) => {
          const y = lns[0].y;
          const rx = svgW + 40;
          const cnt = Math.pow(a, depth);
          const bp = Math.pow(b, depth);
          const cost = depth === 0 ? 'f(n)' : depth === maxDepth ? `${cnt}·Θ(1)` : `${cnt}·f(n/${bp})`;
          return (
            <g key={`lv-${depth}`}>
              <motion.text x={rx} y={y - 8}
                initial={{ opacity: 0, x: rx + 20 }} animate={{ opacity: 0.3, x: rx }}
                transition={{ delay: depth * 0.1 }}
                style={{ fontSize: 9, fontFamily: 'Outfit', fontWeight: 700, fill: 'white', textTransform: 'uppercase' as any }}
              >L{depth} — {cnt} node{cnt > 1 ? 's' : ''}</motion.text>
              <motion.text x={rx} y={y + 8}
                initial={{ opacity: 0, x: rx + 20 }} animate={{ opacity: 0.5, x: rx }}
                transition={{ delay: depth * 0.1 + 0.05 }}
                style={{ fontSize: 10, fontFamily: 'JetBrains Mono', fontWeight: 700, fill: 'white' }}
              >{cost}</motion.text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
