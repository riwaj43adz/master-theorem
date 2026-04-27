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
    if (!revealedDominant) return '#cbd5e1'; // Slate 300
    if (revealedDominant === 'Root' && d === 0) return '#e11d48';
    if (revealedDominant === 'Leaves' && d === maxDepth) return '#059669';
    if (revealedDominant === 'Middle') return '#d97706';
    return '#e2e8f0'; // Slate 200
  };

  const isHigh = (d: number) => revealedDominant && (
    (revealedDominant === 'Root' && d === 0) ||
    (revealedDominant === 'Leaves' && d === maxDepth) ||
    revealedDominant === 'Middle'
  );

  const linkColor = (td: number) => {
    if (!revealedDominant) return '#e2e8f0';
    if (revealedDominant === 'Root' && td <= 1) return '#e11d48';
    if (revealedDominant === 'Leaves' && td === maxDepth) return '#059669';
    if (revealedDominant === 'Middle') return '#d97706';
    return '#f1f5f9';
  };

  const linkOp = (td: number) => {
    if (!revealedDominant) return 0.8;
    if (revealedDominant === 'Root' && td <= 1) return 1;
    if (revealedDominant === 'Leaves' && td === maxDepth) return 1;
    if (revealedDominant === 'Middle') return 0.8;
    return 0.3;
  };

  return (
    <div className="w-full h-full flex items-center justify-center">
      <svg viewBox={`-60 -50 ${svgW + 200} ${svgH + 100}`} className="w-full h-full">
        <defs>
          <radialGradient id="gr"><stop offset="0%" stopColor="#e11d48" stopOpacity="0.2"/><stop offset="100%" stopColor="#e11d48" stopOpacity="0"/></radialGradient>
          <radialGradient id="gl"><stop offset="0%" stopColor="#059669" stopOpacity="0.2"/><stop offset="100%" stopColor="#059669" stopOpacity="0"/></radialGradient>
          <radialGradient id="gm"><stop offset="0%" stopColor="#d97706" stopOpacity="0.2"/><stop offset="100%" stopColor="#d97706" stopOpacity="0"/></radialGradient>
        </defs>

        {links.map((l: any, i: number) => (
          <motion.line key={`l-${a}-${b}-${i}`}
            x1={l.source.x} y1={l.source.y} x2={l.target.x} y2={l.target.y}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: linkOp(l.target.depth), stroke: linkColor(l.target.depth) }}
            transition={{ duration: 0.6, delay: l.target.depth * 0.08 }}
            strokeWidth={1.5}
          />
        ))}

        {nodes.map((n: any, i: number) => {
          const leaf = n.depth === maxDepth;
          const r = leaf ? 6 : n.depth === 0 ? 16 : 10;
          const hi = isHigh(n.depth);
          const c = nodeColor(n.depth);
          return (
            <g key={`n-${a}-${b}-${i}`}>
              {hi && (
                <motion.circle cx={n.x} cy={n.y} r={r * 2.5}
                  fill={revealedDominant === 'Root' ? 'url(#gr)' : revealedDominant === 'Leaves' ? 'url(#gl)' : 'url(#gm)'}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0.4, 0.8, 0.4] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}
              <motion.circle cx={n.x} cy={n.y} r={r}
                fill="white" stroke={c} strokeWidth={hi ? 3 : 2}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4, delay: n.depth * 0.08, type: 'spring', stiffness: 300 }}
              />
            </g>
          );
        })}

        {Array.from(levels.entries()).map(([depth, lns]) => {
          const y = lns[0].y;
          const rx = svgW + 60;
          const cnt = Math.pow(a, depth);
          const bp = Math.pow(b, depth);
          const cost = depth === 0 ? 'f(n)' : depth === maxDepth ? `${cnt}·Θ(1)` : `${cnt}·f(n/${bp})`;
          return (
            <g key={`lv-${depth}`}>
              <motion.text x={rx} y={y - 8}
                initial={{ opacity: 0, x: rx + 20 }} animate={{ opacity: 1, x: rx }}
                transition={{ delay: depth * 0.1 }}
                style={{ fontSize: 10, fontFamily: 'Outfit', fontWeight: 800, fill: '#94a3b8', textTransform: 'uppercase' as any }}
              >L{depth} — {cnt} node{cnt > 1 ? 's' : ''}</motion.text>
              <motion.text x={rx} y={y + 8}
                initial={{ opacity: 0, x: rx + 20 }} animate={{ opacity: 1, x: rx }}
                transition={{ delay: depth * 0.1 + 0.05 }}
                style={{ fontSize: 11, fontFamily: 'JetBrains Mono', fontWeight: 800, fill: '#1e293b' }}
              >{cost}</motion.text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
