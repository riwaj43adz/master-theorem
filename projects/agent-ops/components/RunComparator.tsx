export const RunComparator = ({ runA, runB }: { runA: any; runB: any }) => {
  const diff = runA.totalTokens - runB.totalTokens;
  const latencyDiff = runA.avgLatency - runB.avgLatency;

  return (
    <div className="comparator" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', padding: '20px', background: '#111', borderRadius: '12px' }}>
      <div className="metric-card">
        <h3>Token Delta</h3>
        <p style={{ color: diff > 0 ? '#f87171' : '#34d399', fontSize: '24px', fontWeight: 'bold' }}>
          {diff > 0 ? '+' : ''}{diff} tokens
        </p>
      </div>
      <div className="metric-card">
        <h3>Latency Delta</h3>
        <p style={{ color: latencyDiff > 0 ? '#f87171' : '#34d399', fontSize: '24px', fontWeight: 'bold' }}>
          {latencyDiff > 0 ? '+' : ''}{latencyDiff.toFixed(2)}ms
        </p>
      </div>
    </div>
  );
};
