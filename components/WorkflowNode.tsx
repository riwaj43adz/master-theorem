export const WorkflowNode = ({ name, type, status }: { name: string; type: string; status: string }) => {
  return (
    <div className="node" style={{
      padding: '12px',
      borderRadius: '8px',
      border: '1px solid #333',
      background: '#1a1a1a',
      width: '200px',
      marginBottom: '10px'
    }}>
      <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>{type}</div>
      <div style={{ fontWeight: '600' }}>{name}</div>
      <div style={{ marginTop: '8px', fontSize: '10px', display: 'flex', alignItems: 'center', gap: '4px' }}>
        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: status === 'COMPLETED' ? '#10b981' : '#3b82f6' }}></span>
        {status}
      </div>
    </div>
  );
};
