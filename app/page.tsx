export default function Dashboard() {
  const workflows = [
    { id: '1', name: 'Market Intelligence Agent', status: 'COMPLETED', tasks: 12, lastRun: '2 hours ago' },
    { id: '2', name: 'Legal Doc Summarizer', status: 'RUNNING', tasks: 5, lastRun: 'Active' },
    { id: '3', name: 'Code Quality Auditor', status: 'FAILED', tasks: 8, lastRun: '1 day ago' },
  ];

  return (
    <div className="dashboard-container">
      <header className="header">
        <div className="logo">NexusFlow</div>
        <button className="primary-btn">New Workflow</button>
      </header>

      <main>
        <h1 style={{ marginBottom: '2rem' }}>Active Workflows</h1>
        <div className="workflow-grid">
          {workflows.map((wf) => (
            <div key={wf.id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <h3 style={{ margin: 0 }}>{wf.name}</h3>
                <span className={`status-badge status-${wf.status.toLowerCase()}`}>
                  {wf.status}
                </span>
              </div>
              <div style={{ color: 'var(--secondary)', fontSize: '0.875rem' }}>
                <p>{wf.tasks} tasks in chain</p>
                <p>Last run: {wf.lastRun}</p>
              </div>
              <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.5rem' }}>
                <button className="secondary-btn">Logs</button>
                <button className="secondary-btn">Edit</button>
              </div>
            </div>
          ))}
        </div>
      </main>

      <style jsx>{`
        .primary-btn {
          background: var(--primary);
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
        }
        .secondary-btn {
          background: #222;
          color: #ccc;
          border: 1px solid #333;
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 0.875rem;
          cursor: pointer;
        }
        .secondary-btn:hover {
          background: #333;
        }
      `}</style>
    </div>
  );
}
