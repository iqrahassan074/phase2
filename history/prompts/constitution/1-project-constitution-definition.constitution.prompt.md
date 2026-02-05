---
id: 1
title: Project Constitution Definition
stage: constitution
date: 2026-02-05
surface: agent
model: google/gemini-pro
feature: none
branch: 002-textbook-chatbot
user: 
command: sp.constitution
labels: ["constitution", "project-setup"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:

tests:

---

## Prompt

sp.constitution    # Phase II Constitution – The Evolution of Todo

## Core Principles
- Strictly follow Spec-Driven Development.
- Implementation must be performed using Claude Code / Gemini CLI.
- Human developer acts as Product Architect; no manual coding allowed.
- No boilerplate or hand-written logic.

## Phase II Scope
- Convert Phase I CLI app into multi-user full-stack web application.
- Frontend: Next.js 16+ with TypeScript & Tailwind CSS.
- Backend: Python FastAPI with SQLModel ORM.
- Database: Neon Serverless PostgreSQL.
- Authentication: Better Auth with JWT tokens.
- All endpoints require JWT; requests without token return 401.
- Each user sees and modifies only their own tasks.

## Explicit Exclusions
- No external UI frameworks outside Next.js/Tailwind.
- No manual DB migrations; use SQLModel models only.
- No coding outside Claude/Gemini prompts.

## Quality Standards
- Clean, modular, maintainable code.
- Clear separation of frontend and backend.
- Responsive, user-friendly frontend.
- Predictable REST API behavior.
- Proper error handling and input validation.

## Technology Constraints
- Python 3.13+, FastAPI
- Next.js 16+, TypeScript, Tailwind CSS
- SQLModel ORM, Neon PostgreSQL
- Better Auth JWT
- Claude Code + Spec-Kit Plus

## Response snapshot

Okay, I have processed the constitution. I will now create a Prompt History Record for this interaction.

## Outcome

- ✅ Impact: Project constitution defined, setting the stage for Phase II development.
- 🧪 Tests: N/A
- 📁 Files: PHR created.
- 🔁 Next prompts: Awaiting next user command.
- 🧠 Reflection: The constitution provides clear guidelines for the project. I need to adhere to these principles strictly.

## Evaluation notes (flywheel)

- Failure modes observed: N/A
- Graders run and results (PASS/FAIL): N/A
- Prompt variant (if applicable): N/A
- Next experiment: N/A
