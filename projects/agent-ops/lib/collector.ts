export type AgentLog = {
  id: string;
  runId: string;
  timestamp: string;
  agentName: string;
  action: string;
  input: any;
  output: any;
  tokens: {
    prompt: number;
    completion: number;
  };
  latencyMs: number;
};

export class LogCollector {
  private logs: AgentLog[] = [];

  async ingest(log: AgentLog) {
    console.log(`[AgentOps] Ingesting log for run ${log.runId}`);
    this.logs.push(log);
    
    // In a real app, this would persist to a database (e.g., Supabase/Postgres)
    // and potentially trigger alerts for high latency/cost.
    return { success: true };
  }

  getSummary(runId: string) {
    const runLogs = this.logs.filter(l => l.runId === runId);
    const totalTokens = runLogs.reduce((acc, l) => acc + l.tokens.prompt + l.tokens.completion, 0);
    const totalLatency = runLogs.reduce((acc, l) => acc + l.latencyMs, 0);
    
    return {
      runId,
      logCount: runLogs.length,
      totalTokens,
      avgLatency: totalLatency / (runLogs.length || 1),
    };
  }
}
