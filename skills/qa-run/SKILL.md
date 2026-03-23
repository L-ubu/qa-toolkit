---
name: qa-run
description: Orchestrate a full QA run: spawn parallel subagents for Frontend, Backend, and E2E QA, then merge results into report, functional report, fix list, Jira tickets, Confluence checklist, Docsify dashboard, and Slack summary. Use when the user says /qa, /qa-full, "run QA", "full QA", or "QA this project".
---

# QA Run — Orchestrator

Run a full QA pass by executing Frontend, Backend, and E2E QA in parallel, then merging and delivering all artifacts including a Docsify dashboard.

## Input (from user)

Gather or prompt for:

- **Repo:** path or URL + branch (required).
- **Links (optional):** Storybook URL, staging/app URL, API base URL. **If only local dev is running (e.g. DDEV), still run responsive tests against it** — the E2E and Frontend agents should test local URLs at mobile/tablet/desktop viewports.
- **Exclusions (optional):** paths or areas to skip.
- **Deliverables:** All of the below are produced by default:
  - Full technical QA report + fix list (grouped by component: Frontend / JS/React / Backend).
  - **Functional report** (PM/client-facing, plain language, no code references).
  - **Functional checklist** (PM decision tool, sorted by feature area, with severity badges).
  - Jira tickets (via MCP if configured), grouped by component, labeled `functional` or `technical`.
  - Confluence page (via MCP if configured).
  - Slack summary (if Slack MCP configured).
  - **Screenshots** at desktop (1280px), tablet (768px), mobile (375px) viewports.
  - **Videos:** E2E flow (desktop), mobile viewport, tablet viewport.
  - **Docsify dashboard** assembling everything into a browsable site.

## Phase 0 — Scaffold Docsify dashboard

Before running QA agents, scaffold the Docsify output directory:

```bash
bash .cursor/qa-docsify-template/setup-docsify.sh \
  qa-output \
  "PROJECT_NAME" \
  "project-slug" \
  "branch-name" \
  "$(date +%Y-%m-%d)" \
  "Stack description"
```

This creates `qa-output/` with the template files, screenshot/video directories, and placeholder pages. The merge agent will fill in the actual content.

## Phase 1 — Parallel QA (subagents)

Spawn **three parallel subagents** (or parallel tasks), each with the same repo and options:

1. **Frontend QA** — Invoke the qa-frontend skill (Storybook, visual, responsive). Pass: repo, Storybook URL, app URL (even if local-only), exclusions. **Must capture responsive screenshots** at 3 viewports and save to `qa-output/screenshots/`. Each finding must include **audience** tag (Functional or Technical). Output: list of findings with IDs like FE-xx, screenshot paths.

2. **Backend QA** — Invoke the qa-backend skill (contracts, errors, basic security). Pass: repo, API base URL, exclusions. Each finding must include **audience** tag. Output: list of findings with IDs like API-xx.

3. **E2E QA** — Invoke the qa-e2e skill (critical flows, browser recording). Pass: app URL (**use local dev URL if that's all that's available**), list of critical flows or "infer from repo", exclusions. **Must run flows at mobile (375px) and tablet (768px) viewports too**, not just desktop. Each finding must include **audience** tag. Output: list of findings + video paths + screenshot paths.

Wait for all three to complete. If a subagent cannot run (e.g. no Storybook URL), it returns an empty or partial list and a note; do not block the rest.

## Phase 2 — Merge and deliver

Invoke the **qa-merge-report** skill with:

- All findings from Frontend, Backend, E2E (each tagged with **audience**: Functional or Technical).
- Screenshot paths and video paths.
- Project name (from repo or user).
- Run id (e.g. branch name or date).
- Targets: Jira project/key, Confluence space/parent, Slack channel (from user or config).

The merger produces:

- Full technical QA report (markdown).
- **Functional report** (plain language, PM/client-facing).
- **Functional checklist** (sorted by feature area, with severity badges and checkboxes).
- Fix list (markdown table grouped by component, with audience column).
- Jira tickets (if MCP), sorted by component, labeled `functional`/`technical`.
- Confluence QA checklist (with F/T audience indicator per item).
- PM-friendly summary (for chat and Slack).
- **Docsify dashboard** — fills in template placeholders, copies all reports and media, ready to serve.

## Phase 3 — Serve, share, and confirm

1. Serve the Docsify dashboard: `npx docsify-cli serve qa-output --port 3333`
2. Create a **shareable public link** via Cloudflare tunnel: `npx cloudflared tunnel --url http://localhost:3333` — this gives a URL anyone can open without login or setup. Include this URL in the PM summary.
3. Output the **PM-friendly summary** in the chat:
   - Total findings, split by functional vs technical.
   - Counts per severity and component.
   - **Clear references:** Docsify dashboard URL (localhost:3333), report paths, Jira keys, Confluence link, video/screenshot locations.
3. Highlight: "Share the **functional report** with the PM/client. Share the **technical report** with devs."

If something failed (e.g. MCP create), say so and point to the markdown artifacts for manual steps.

## Commands (how users can trigger)

- **Full QA:** `/qa` or `/qa-full` — run all three areas + merge + all deliverables + Docsify.
- **Targeted:** `/qa-frontend`, `/qa-backend`, `/qa-e2e` — run only that area, then still run the merger.
- **Report only:** `/qa-report-only` — if findings already exist, run only the merger to regenerate all artifacts + Docsify.

## Notes

- Use the QA report format rule for any finding or artifact you write. **Every finding must have an audience tag** (Functional or Technical).
- **Responsive testing is mandatory** even with only a local dev environment (DDEV, localhost). Use Playwright or browser automation to open the local URL at mobile/tablet/desktop viewports.
- The Docsify template lives in `.cursor/qa-docsify-template/` and is reusable across projects and runs. Don't modify the template — the setup script copies it and the merge agent fills in project-specific content.
- **Component grouping** (Frontend / JS/React / Backend) applies to all projects. Project-specific structure (e.g. JLR feature areas) is used when `.cursor/qa-reference/` exists.
- The **functional report and checklist** are the PM's main tools. Write them so someone with zero technical knowledge can read them, understand what's broken, and decide what to prioritise.
