
export function generateRecursiveCode(a: number, b: number, d: number, k: number): string {
  const fNString = getComplexityString(d, k);
  const recursiveCalls = Array(a).fill(`  solve(n / ${b});`).join('\n');
  
  let loopCode = '';
  if (d === 0 && k === 0) {
    loopCode = '// O(1) work';
  } else if (d === 1 && k === 0) {
    loopCode = 'for (let i = 0; i < n; i++) {\n    // O(1) work\n  }';
  } else if (d === 2 && k === 0) {
    loopCode = 'for (let i = 0; i < n; i++) {\n    for (let j = 0; j < n; j++) {\n      // O(1) work\n    }\n  }';
  } else if (d === 0 && k === 1) {
    loopCode = 'for (let i = 1; i < n; i *= 2) {\n    // O(1) work\n  }';
  } else if (d === 1 && k === 1) {
    loopCode = 'for (let i = 0; i < n; i++) {\n    for (let j = 1; j < n; j *= 2) {\n      // O(1) work\n    }\n  }';
  } else {
    loopCode = `// Work of complexity ${fNString}`;
  }

  return `function solve(n) {
  if (n <= 1) return;

  // Non-recursive work: ${fNString}
  ${loopCode}

  // ${a} recursive calls of size n/${b}
${recursiveCalls}
}`;
}

function getComplexityString(d: number, k: number): string {
  if (d === 0 && k === 0) return 'Θ(1)';
  if (d === 1 && k === 0) return 'Θ(n)';
  if (d === 2 && k === 0) return 'Θ(n²)';
  if (d === 0 && k === 1) return 'Θ(log n)';
  if (d === 1 && k === 1) return 'Θ(n log n)';
  return `Θ(n^${d}${k > 0 ? ` log^${k} n` : ''})`;
}

export type AnalysisResult = {
  a: number;
  b: number;
  d: number;
  k: number;
  isValid: boolean;
  error?: string;
};

export function analyzeCode(code: string): AnalysisResult {
  // Very basic heuristic analysis
  const recursiveCallRegex = /solve\s*\(\s*n\s*\/\s*(\d+)\s*\)|solve\s*\(\s*n\s*\/\s*b\s*\)/g;
  const matches = [...code.matchAll(recursiveCallRegex)];
  
  if (matches.length === 0) {
    return { a: 0, b: 0, d: 0, k: 0, isValid: false, error: "No recursive calls to solve(n/b) found." };
  }

  const bValues = matches.map(m => parseInt(m[1]));
  const b = bValues[0];
  const a = matches.length;

  if (!bValues.every(val => val === b)) {
    return { a, b, d: 0, k: 0, isValid: false, error: "Subproblem sizes (b) must be identical for Master Theorem." };
  }

  // Heuristic for f(n)
  let d = 0;
  let k = 0;

  if (code.includes('for') || code.includes('while')) {
    const lines = code.split('\n');
    let nestedLoops = 0;
    let maxNested = 0;
    for (const line of lines) {
      if (line.includes('for') || line.includes('while')) {
        nestedLoops++;
        maxNested = Math.max(maxNested, nestedLoops);
      }
      if (line.includes('}')) {
        nestedLoops = Math.max(0, nestedLoops - 1);
      }
    }
    
    // Check for log patterns
    if (code.includes('*= 2') || code.includes('/= 2') || code.includes('>>= 1')) {
       if (maxNested > 1) {
         d = maxNested - 1;
         k = 1;
       } else {
         d = 0;
         k = 1;
       }
    } else {
      d = maxNested;
    }
  }

  return { a, b, d, k, isValid: true };
}
