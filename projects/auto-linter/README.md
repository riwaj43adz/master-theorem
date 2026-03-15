# AutoLinter AI

An LLM-powered CLI tool that goes beyond syntax linting to provide architectural and security insights.

## Why AutoLinter?
Standard linters (ESLint, Prettier) catch syntax errors. AutoLinter catches "thinking errors":
- Leaking business logic into the UI layer.
- Over-engineered abstractions.
- Potential security vulnerabilities in prompt handling.
- Missing error handling in async workflows.

## Features
- **Context-Aware Analysis**: Scans your whole project for better understanding.
- **Git Integration**: Only lint changed files in your PR.
- **Customizable Rules**: Define your own architectural principles in plain English.

## Tech Stack
- Node.js / Commander.js
- OpenAI / Anthropic API
- Fast-glob for file scanning
