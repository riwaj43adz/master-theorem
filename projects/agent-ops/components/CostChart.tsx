'use client';

import React from 'react';
// In a real app, we would import from 'recharts'
// Here we simulate a simplified chart component for the MVP

export const CostChart = ({ data }: { data: any[] }) => {
  return (
    <div className="chart-container" style={{ padding: '20px', background: '#111', borderRadius: '12px', border: '1px solid #333' }}>
      <h3 style={{ marginBottom: '20px', color: '#888' }}>Token Usage Over Time</h3>
      <div style={{ display: 'flex', alignItems: 'flex-end', height: '200px', gap: '8px' }}>
        {data.map((d, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              background: 'linear-gradient(to top, #3b82f6, #8b5cf6)',
              height: `${(d.tokens / 5000) * 100}%`,
              borderRadius: '4px 4px 0 0',
              position: 'relative'
            }}
            title={`${d.date}: ${d.tokens} tokens`}
          >
            <span style={{ position: 'absolute', top: '-20px', left: '0', fontSize: '10px', color: '#666' }}>{d.tokens}</span>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px', fontSize: '12px', color: '#444' }}>
        <span>Mon</span>
        <span>Tue</span>
        <span>Wed</span>
        <span>Thu</span>
        <span>Fri</span>
        <span>Sat</span>
        <span>Sun</span>
      </div>
    </div>
  );
};
