---
name: qa-backend
description: Run Backend/API QA: contracts (request/response), error handling, basic security. Tag every finding as Functional or Technical. Use when the user runs a full QA, /qa-backend, or asks for backend-only QA.
---

# QA — Backend / API

Run backend/API-focused QA and output findings in the shared QA report format. **Every finding must be tagged with audience** (Functional or Technical).

## Input (from user or orchestrator)

- **Repo path** (and optional branch).
- **API base URL** or OpenAPI/Swagger URL (if available).
- **Exclusions** (paths to skip, e.g. legacy or generated code).

## Steps

1. **Identify API surface**
   - Find API definitions (OpenAPI, Symfony routes, Drupal endpoints, or inline docs).
   - List main endpoints (auth, CRUD, critical flows).

2. **Contracts**
   - For each critical endpoint: check request shape (body, query, headers) and response shape (status, body, errors).
   - Compare to client usage (frontend or SDK): mismatches = findings.
   - Output findings with IDs like `API-01`, `API-02`.

3. **Error handling**
   - Trigger error cases (invalid input, 401, 404, 500) where possible.
   - Check: consistent error body shape, appropriate status codes, no stack traces or secrets in response.

4. **Basic security**
   - Note: auth on protected routes, no sensitive data in URLs or logs, CORS/headers if relevant.
   - Flag obvious issues (e.g. password in query param, missing auth on admin endpoint); do not run full pentest.

5. **Output**
   - Structured list of findings. Each must include:
     - ID, title, area=Backend, **component**=Backend, **audience** (Functional or Technical), severity, steps, expected/actual, suggestion.
     - **Functional description** (for Functional findings): 1–2 plain-language sentences about what the user would experience as a result of this backend issue. No code references.

   **Audience tagging for backend findings:**
   - Missing endpoint that causes a user-facing feature to not work → **Functional** (e.g. "The billing address form silently fails because the backend doesn't have this feature yet").
   - API contract mismatch that causes wrong data to display → **Functional**.
   - Security issue with no visible user impact (e.g. CORS misconfiguration, log leaking) → **Technical**.
   - Code-level issues (duplicate listeners, wrong validation type, doc mismatches) → **Technical**.
   - If unsure: would a PM care? → Functional. Would only a dev care? → Technical.

## Notes

- Use the QA report format rule for every finding. **Audience tag is mandatory.**
- Backend findings use **component** = Backend.
- If no API spec or base URL is given, say so and skip contract/error steps or infer from code only.
- **Project-specific (e.g. JLR MSS):** If the repo has `.cursor/qa-reference/jlr-qa-structure.md`, tag findings with **layer** (Symfony, Drupal) and **feature**.
