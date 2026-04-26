// ─── Types ───────────────────────────────────────────────────────────────────

export type FnOption = {
  id: string;
  label: string;
  /** polynomial degree: f(n) ∈ Θ(n^d · log^k n) */
  d: number;
  /** logarithmic multiplier exponent */
  k: number;
  /** HTML-safe label for rendering */
  html: string;
};

export type DominantPart = 'Root' | 'Middle' | 'Leaves';

export type MasterTheoremResult = {
  caseNum: 1 | 2 | 3;
  dominant: DominantPart;
  explanation: string;
  complexityHtml: string;
  logBa: number;
  /** Human-readable comparison string, e.g. "log₂(4) = 2 > 1" */
  comparison: string;
};

// ─── Constants ───────────────────────────────────────────────────────────────

export const fnOptions: FnOption[] = [
  { id: '1',       label: 'Θ(1)',       d: 0, k: 0, html: 'Θ(1)' },
  { id: 'log_n',   label: 'Θ(log n)',   d: 0, k: 1, html: 'Θ(log&thinsp;n)' },
  { id: 'n',       label: 'Θ(n)',       d: 1, k: 0, html: 'Θ(n)' },
  { id: 'n_log_n', label: 'Θ(n log n)', d: 1, k: 1, html: 'Θ(n&thinsp;log&thinsp;n)' },
  { id: 'n2',      label: 'Θ(n²)',      d: 2, k: 0, html: 'Θ(n²)' },
];

// ─── Engine ──────────────────────────────────────────────────────────────────

const EPS = 1e-9;

function fmtLogBa(logBa: number): string {
  return Math.abs(logBa - Math.round(logBa)) < EPS
    ? Math.round(logBa).toString()
    : logBa.toFixed(3);
}

/**
 * Classify a recurrence T(n) = a·T(n/b) + Θ(n^d · log^k n)
 * under the extended Master Theorem.
 */
export function getMasterTheoremCase(
  a: number,
  b: number,
  fn: FnOption
): MasterTheoremResult {
  const logBa = Math.log(a) / Math.log(b);
  const d = fn.d;
  const k = fn.k;
  const logBaStr = fmtLogBa(logBa);

  if (logBa > d + EPS) {
    // Case 1: leaf-heavy
    const nPow = logBaStr;
    return {
      caseNum: 1,
      dominant: 'Leaves',
      explanation: `The recursion fans out faster than f(n) grows. The cost concentrates at the leaves, giving Θ(n^${nPow}).`,
      complexityHtml: `Θ(n<sup>${nPow}</sup>)`,
      logBa,
      comparison: `log<sub>${b}</sub>(${a}) = ${logBaStr} &gt; ${d}`,
    };
  } else if (Math.abs(logBa - d) <= EPS) {
    // Case 2: balanced
    const newK = k + 1;
    const logPart = newK === 1 ? 'log&thinsp;n' : `log<sup>${newK}</sup>&thinsp;n`;
    const complexityHtml = d === 0
      ? `Θ(${logPart})`
      : `Θ(n<sup>${d}</sup>&thinsp;${logPart})`;
    return {
      caseNum: 2,
      dominant: 'Middle',
      explanation: `The recursive branching exactly matches f(n). Cost distributes evenly across all log(n) levels, adding a log factor.`,
      complexityHtml,
      logBa,
      comparison: `log<sub>${b}</sub>(${a}) = ${logBaStr} = ${d}`,
    };
  } else {
    // Case 3: root-heavy
    return {
      caseNum: 3,
      dominant: 'Root',
      explanation: `f(n) dominates the recursion cost. The root level does the most work, so the total is Θ(${fn.label}).`,
      complexityHtml: fn.html,
      logBa,
      comparison: `log<sub>${b}</sub>(${a}) = ${logBaStr} &lt; ${d}`,
    };
  }
}

// ─── Cost helpers for visualization ──────────────────────────────────────────

/** Evaluate f(n) = n^d · log^k(n) numerically */
export function evaluateFn(fn: FnOption, n: number): number {
  if (n <= 0) return 0;
  const logVal = Math.max(Math.log2(n), 0);
  return Math.pow(n, fn.d) * Math.pow(logVal || 1, fn.k);
}

/** Cost at a specific level of the recursion tree */
export function levelCost(a: number, b: number, fn: FnOption, level: number, n: number): number {
  const numNodes = Math.pow(a, level);
  const subproblemSize = n / Math.pow(b, level);
  if (subproblemSize < 1) return numNodes; // base case cost
  return numNodes * evaluateFn(fn, subproblemSize);
}

// ─── Step expansion generator ────────────────────────────────────────────────

export type ExpansionStep = {
  depth: number;
  /** e.g. "2²·T(n/4)" */
  termHtml: string;
  /** e.g. "+ 2·f(n/2)" */
  costTermHtml: string;
};

export function generateExpansionSteps(a: number, b: number, fn: FnOption, maxSteps: number = 5): ExpansionStep[] {
  const steps: ExpansionStep[] = [];

  for (let i = 0; i <= maxSteps; i++) {
    const aPow = Math.pow(a, i);
    const bPow = Math.pow(b, i);

    const aPowStr = i === 0 ? '' : (i === 1 ? `${a}` : `${a}<sup>${i}</sup>`);
    const bPowStr = i === 0 ? 'n' : (i === 1 ? `n/${b}` : `n/${b}<sup>${i}</sup>`);

    const termHtml = i === 0
      ? `T(n)`
      : `${aPowStr}·T(${bPowStr})`;

    const costTermHtml = i === 0
      ? `f(n)`
      : (i === 1
        ? `${a > 1 ? a + '·' : ''}f(n/${b})`
        : `${aPow}·f(${bPowStr})`);

    steps.push({ depth: i, termHtml, costTermHtml });
  }

  return steps;
}

// ─── Example presets ─────────────────────────────────────────────────────────

export type ExamplePreset = {
  name: string;
  a: number;
  b: number;
  fnId: string;
  description: string;
};

export const examplePresets: ExamplePreset[] = [
  { name: 'Merge Sort',     a: 2, b: 2, fnId: 'n',       description: '2T(n/2) + Θ(n)' },
  { name: 'Binary Search',  a: 1, b: 2, fnId: '1',       description: 'T(n/2) + Θ(1)' },
  { name: 'Karatsuba',      a: 3, b: 2, fnId: 'n',       description: '3T(n/2) + Θ(n)' },
  { name: 'Strassen',       a: 7, b: 2, fnId: 'n2',      description: '7T(n/2) + Θ(n²)' },
  { name: 'Closest Pair',   a: 2, b: 2, fnId: 'n_log_n', description: '2T(n/2) + Θ(n log n)' },
];
