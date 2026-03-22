import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export type TaskResult = {
  success: boolean;
  data?: any;
  error?: string;
};

export class WorkflowRunner {
  private runId: string;

  constructor(runId: string) {
    this.runId = runId;
  }

  async execute() {
    console.log(`Starting execution for Run: ${this.runId}`);
    
    await prisma.run.update({
      where: { id: this.runId },
      data: { status: 'RUNNING' },
    });

    try {
      const run = await prisma.run.findUnique({
        where: { id: this.runId },
        include: { workflow: { include: { tasks: { orderBy: { order: 'asc' } } } } },
      });

      if (!run) throw new Error('Run not found');

      for (const task of run.workflow.tasks) {
        await this.log('INFO', `Executing task: ${task.name} (${task.type})`);
        
        const result = await this.executeTask(task);
        
        if (!result.success) {
          await this.log('ERROR', `Task failed: ${result.error}`);
          throw new Error(result.error);
        }

        await this.log('INFO', `Task completed successfully: ${task.name}`);
      }

      await prisma.run.update({
        where: { id: this.runId },
        data: { status: 'COMPLETED', finishedAt: new Date() },
      });

    } catch (error: any) {
      console.error('Workflow failed:', error);
      await prisma.run.update({
        where: { id: this.runId },
        data: { status: 'FAILED', finishedAt: new Date() },
      });
    }
  }

  private async executeTask(task: any): Promise<TaskResult> {
    const maxRetries = task.config?.maxRetries || 3;
    const delay = task.config?.retryDelay || 1000;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        // Simulated task execution
        return await new Promise((resolve, reject) => {
          setTimeout(() => {
            // Simulate 20% failure rate for testing retries
            if (Math.random() < 0.2) reject(new Error('Transient failure'));
            else resolve({ success: true, data: { status: 'ok', attempt } });
          }, 500);
        });
      } catch (error: any) {
        await this.log('WARN', `Attempt ${attempt} failed for task ${task.name}: ${error.message}`);
        if (attempt === maxRetries) return { success: false, error: error.message };
        await new Promise(r => setTimeout(r, delay * attempt)); // Exponential backoff simulation
      }
    }
    return { success: false, error: 'Unknown error' };
  }

  private async log(level: string, message: string) {
    // Persist to local DB
    await prisma.log.create({
      data: {
        runId: this.runId,
        level,
        message,
      },
    });

    // Send to AgentOps Dashboard (simulated)
    console.log(`[AgentOps] Forwarding log: ${message}`);
  }
}
