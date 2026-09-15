# Master Theorem Basic

A high-performance, distributed task orchestrator for autonomous LLM agents.

## Overview
NexusFlow solves the reliability problem in multi-step agentic workflows. By providing a stateful orchestration layer, it ensures that long-running agent tasks can survive failures, retries, and interruptions.

## Features
- **Deterministic Orchestration**: State machine based execution.
- **Agent Persistence**: Snapshotting agent state at every step.
- **Provider Agnostic**: Support for OpenAI, Anthropic, and local models.
- **Visual Monitor**: Real-time observability dashboard.

## Tech Stack
- Next.js 15
- TypeScript
- Prisma + PostgreSQL
- Redis (Queue)

## Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/riwaj43adz/nexus-flow.git
   cd nexus-flow
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Database Configuration**
   Create a `.env` file and add your PostgreSQL connection string:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/nexusflow"
   ```

4. **Initialize Database**
   ```bash
   npx prisma db push
   ```

5. **Run Development Server**
   ```bash
   npm run dev
   ```

## Roadmap
- [ ] Drag-and-drop workflow builder.
- [ ] Support for local Ollama models.
- [ ] Multi-agent collaborative modes.
- [ ] Export to Python/LangGraph.

## License
MIT
