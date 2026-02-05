---
id: 7
title: Fix useNavigate Router Context Error
stage: red
date: 2026-02-05
surface: agent
model: google/gemini-pro
feature: todo-app
branch: 002-textbook-chatbot
user: 
command: # Not a direct command, but the action taken
labels: ["frontend", "bugfix", "react-router-dom"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
 - frontend/src/App.tsx
 - frontend/src/index.tsx
tests: N/A

---

## Prompt

The user reported the error: "useNavigate() may be used only in the context of a <Router> component."

## Task
Address and fix the reported error related to `useNavigate` being called outside of a router context.

## Outcome

- ✅ **useNavigate Context Error**: Resolved by moving the `BrowserRouter` component from `frontend/src/App.tsx` to `frontend/src/index.tsx`, ensuring that the `App` component and its children are properly nested within the router's context.

## Evaluation Notes
The `useNavigate` hook, and other routing hooks from `react-router-dom`, must be used by components that are descendants of a `Router` component. The `App` component itself was using `useNavigate` while also defining the `Router`, which caused the conflict. Moving the `Router` higher in the component tree (to `index.tsx`) correctly establishes the routing context for all components, including `App`.

## Next Steps
The frontend should now run without the `useNavigate` context error. The user can proceed to run the application using the previously provided instructions.
