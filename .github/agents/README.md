# Sub-Agents — Podcast Episode Planner

Specialized sub-agents under [PM-Agent v2.0](../../.agent.md). PM-Agent plans and delegates; these agents execute focused work in their domain.

| Agent              | File                                                       | Domain                                           |
| ------------------ | ---------------------------------------------------------- | ------------------------------------------------ |
| Backend-Dev        | [backend-dev.agent.md](backend-dev.agent.md)               | Express + Prisma routes, controllers, middleware |
| Frontend-Dev       | [frontend-dev.agent.md](frontend-dev.agent.md)             | React + Vite + Tailwind + Redux Toolkit          |
| Database-Architect | [database-architect.agent.md](database-architect.agent.md) | Prisma schema, migrations, seed                  |
| AI-Engineer        | [ai-engineer.agent.md](ai-engineer.agent.md)               | EPAM DIAL integration, prompts, generations      |
| QA-Tester          | [qa-tester.agent.md](qa-tester.agent.md)                   | Jest, Vitest+RTL, Cypress, a11y, perf            |
| Integration        | [integration.agent.md](integration.agent.md)               | Contract diff + smoke-test checklist             |
| Documentation      | [documentation.agent.md](documentation.agent.md)           | README, API docs, user guide, ADRs, changelog    |

## How to invoke

From Copilot Chat:

- `@PM-Agent plan sprint 2`
- `@Backend-Dev add a comments endpoint per the contract`
- `@Integration run the checklist`

## Add a new sub-agent

1. Create `<name>.agent.md` in this folder with frontmatter `name` and `description`.
2. Define: when to invoke, conventions, hard rules, tooling, output style.
3. Add a row to the table above.
4. Reference it from PM-Agent's sub-agent roster if it should be delegated to automatically.
