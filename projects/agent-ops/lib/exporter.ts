import { AgentLog } from './collector';

export class DataExporter {
  static toCSV(logs: AgentLog[]) {
    const header = 'id,runId,timestamp,agentName,action,tokensPrompt,tokensCompletion,latencyMs\n';
    const rows = logs.map(l => 
      `${l.id},${l.runId},${l.timestamp},${l.agentName},${l.action},${l.tokens.prompt},${l.tokens.completion},${l.latencyMs}`
    ).join('\n');
    return header + rows;
  }

  static toJSON(logs: AgentLog[]) {
    return JSON.stringify(logs, null, 2);
  }
}
