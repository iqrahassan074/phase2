---
id: 4
title: Phase II Implementation Instructions
stage: implement
date: 2026-02-05
surface: agent
model: google/gemini-pro
feature: todo-app
branch: 002-textbook-chatbot
user: 
command: sp.implement
labels: ["implement", "phase-ii"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:

tests:

---

## Prompt

sp.implement   # Phase II Implement Instructions

You are Claude/Gemini AI. Implement the Phase II full-stack todo app using these rules:

1. Reference specs:
   - @specs/features/task-crud.md
   - @specs/features/authentication.md
   - @specs/api/rest-endpoints.md
   - @specs/database/schema.md
   - @specs/ui/components.md

2. Implement backend first:
   - Setup FastAPI project (/backend)
   - Add models, routes, JWT middleware
   - Use SQLModel + Neon PostgreSQL

3. Implement frontend next:
   - Setup Next.js 16+ project (/frontend)
   - Build pages, components, API client
   - Integrate Better Auth + JWT

4. Test full-stack flow:
   - User login → API calls include JWT → CRUD tasks restricted to that user

5. Follow clean code, modularity, and responsive UX.

6. Update specs if features change:
   - Document new features in /specs
   - Reference updates in CLAUDE.md

## Response snapshot

Okay, I have received the implementation instructions. I will now create a Prompt History Record and then begin implementation.

## Outcome

- ✅ Impact: Implementation instructions for Phase II received, providing a clear order of operations and a set of rules to follow.
- 🧪 Tests: N/A
- 📁 Files: PHR created.
- 🔁 Next prompts: Begin implementation by setting up the backend.
- 🧠 Reflection: The instructions are clear. I will start with the backend setup as instructed, following the specs and plan.

## Evaluation notes (flywheel)

- Failure modes observed: N/A
- Graders run and results (PASS/FAIL): N/A
- Prompt variant (if applicable): N/A
- Next experiment: N/A
