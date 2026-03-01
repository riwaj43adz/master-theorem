# NexusFlow

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

## Status
Work in Progress.
