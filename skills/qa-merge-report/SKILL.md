---
name: qa-merge-report
description: Merge QA findings from frontend, backend, and E2E subagents into final report, functional report, functional checklist, fix list, Confluence body, Jira tickets, and Docsify dashboard. Post Slack summary when done. Use after parallel QA subagents have finished.
---

# QA — Merge Report & Deliverables

Take structured findings from Frontend, Backend, and E2E QA (with audience tags, screenshot paths, video paths), then produce all final artifacts including the **functional/technical split** and **Docsify dashboard**.

## Input

- **Findings lists** from qa-frontend, qa-backend, qa-e2e. Each finding has: ID, title, area, **audience** (Functional or Technical), severity, steps, suggestion, evidence, and optionally a **functional description** (plain-language).
- **Screenshot paths** from Frontend and E2E agents (organized by viewport: desktop/tablet/mobile).
- **Video paths** from E2E (and any from Frontend).
- **Project name** and optional run id (e.g. branch, date).
- **Targets:** Jira project/key, Confluence space/parent, Slack channel.

## Steps

### 1. Merge, deduplicate, and classify

- Combine all findings. Each finding already has an **audience** tag (Functional or Technical) from its source agent.
- Verify audience classification: if a finding is tagged Technical but clearly user-visible, reclassify to Functional.
- Assign each finding a **component** bucket: Frontend (design/styling/responsive), JS/React (frontend logic), Backend (API/server).
- Sort by severity (P0 first), then by component.
- **Project-specific (e.g. JLR MSS):** If `.cursor/qa-reference/jlr-qa-structure.md` exists, also tag with **feature** and **layer** for Confluence.
- Count totals: overall, per severity, per component, per audience (Functional vs Technical).

### 2. Full technical QA report

- Write the complete report in markdown (all findings, full detail, code paths, suggestions).
- Include a summary with: total, per severity, per component, **functional vs technical counts**.
- Add "Videos / recordings" section with all video paths.
- Save as `qa-output/qa-report-{project-slug}-{date}.md`.

### 3. Functional report (PM / Client)

- Create `qa-output/qa-functional-report.md` containing **ONLY findings tagged as Functional**.
- Write in **plain language** — no file paths, no code references, no technical jargon.
- For each finding, use the **functional description** from the source agent (or write one if missing).
- Structure by feature area (project-specific) or by severity (generic).
- Each finding includes:
  - **Severity badge:** 🔴 P0 / 🟠 P1 / 🟡 P2 / 🟢 P3
  - **What happens:** Plain description of what the user sees.
  - **Where:** Page or flow where it occurs.
  - **Impact:** Why it matters (e.g. "Users cannot complete their booking").
  - **Screenshot/video reference** if available.
- Include a summary at the top with functional-only counts.
- End with a link to screenshots/videos page and a note that the technical report exists for devs.

### 4. Functional checklist (PM decision tool)

- Create `qa-output/qa-functional-checklist.md` with **checkbox items for each Functional finding**.
- Group by **feature area** (for project-specific) or by **page/section** (generic).
- Each item is one line in plain language with severity badge:
  ```
  - [ ] 🔴 P0 — [Plain description of what user sees]
  - [ ] 🟠 P1 — [Plain description]
  ```
- The PM uses this to mark items: ✅ Fix / ❌ Won't fix / ⏳ Later / ❓ Discuss.
- Include a "How to use" header explaining the severity levels and decision options.
- This is the PM's primary tool for budget decisions.

### 5. Fix list (table for PM / Jira)

- Group by component: Frontend → JS/React → Backend.
- Table columns: ID | Title | Severity | **Audience** | Component | Suggested ticket summary.
- The **Audience** column (Functional / Technical) helps PM quickly filter.
- Save as `qa-output/qa-fix-list-{project-slug}-{date}.md`.
- If Jira MCP is configured: create one issue per finding, grouped by component. Add label `functional` or `technical` based on audience. Summary and description from fix list.

### 6. Confluence QA checklist

- Default: group by component. Add **audience indicator** per item (F = Functional, T = Technical).
- Project-specific (JLR MSS): group by feature area → layer as in `.cursor/qa-reference/jlr-qa-structure.md`. Add F/T indicator.
- If Confluence MCP configured: create page. Otherwise output markdown.
- Save as `qa-output/qa-confluence-checklist-{project-slug}-{date}.md`.

### 7. Jira tickets

- Create `qa-output/qa-jira-tickets-{project-slug}-{date}.md` with pre-formatted ticket content.
- If Jira MCP is configured: create tickets with `functional` or `technical` label.

### 8. Assemble Docsify dashboard

This is where everything comes together visually.

1. **Scaffold** (if not already done by orchestrator):
   ```bash
   bash .cursor/qa-docsify-template/setup-docsify.sh \
     qa-output "PROJECT_NAME" "project-slug" "branch" "date" "stack"
   ```

2. **Fill in README.md placeholders** — replace `{{TOTAL}}`, `{{P0_COUNT}}`, etc. with actual counts. Also fill `{{FUNCTIONAL_COUNT}}`, `{{TECHNICAL_COUNT}}`, `{{P0_TABLE}}` (table of P0 findings), `{{SCREENSHOTS_STATUS}}`, `{{E2E_DESKTOP_STATUS}}`, etc.

3. **Fill in functional report/checklist** — replace `{{FUNCTIONAL_FINDINGS}}`, `{{FUNCTIONAL_CHECKLIST_CONTENT}}` with the actual content generated in steps 3 and 4.

4. **Fill in media.md** — replace `{{DESKTOP_SCREENSHOTS}}`, `{{TABLET_SCREENSHOTS}}`, `{{MOBILE_SCREENSHOTS}}` with actual image tags pointing to files in `screenshots/`. Replace video placeholders with `<video>` tags pointing to files in `videos/`.

   Screenshot format for media.md:
   ```html
   <img src="screenshots/desktop/homepage-desktop.png" alt="Homepage — Desktop">
   <img src="screenshots/desktop/checkout-desktop.png" alt="Checkout — Desktop">
   ```

   Video format for media.md:
   ```html
   <video controls><source src="videos/e2e-flow-desktop.mp4" type="video/mp4"></video>
   ```

5. **Verify** all report markdown files are in `qa-output/` (the report, fix list, Jira tickets, Confluence checklist, functional report, functional checklist are all already there from previous steps).

6. **Serve locally:**
   ```bash
   npx docsify-cli serve qa-output --port 3333
   ```

7. **Create shareable link via Cloudflare tunnel:**
   ```bash
   npx cloudflared tunnel --url http://localhost:3333
   ```
   This gives a public URL (e.g. `https://random-words.trycloudflare.com`) that anyone can open — no login, no setup. The tunnel stays alive as long as the process runs.
   
   - Include the tunnel URL in the PM-friendly summary and Slack post.
   - Note in the summary: "Link stays active as long as the agent/machine is running."

### 9. PM-friendly summary (for chat and Slack)

Produce one **clean, non-technical summary**:

- **Heading:** e.g. "QA run complete — [Project name]"
- **Overview:** Total findings, split by functional (X user-facing issues) vs technical (Y code-level issues). Per severity: P0/P1/P2/P3 counts.
- **For the PM:** "The **functional report** has [N] issues that users would see on the website. Review the **functional checklist** to decide which to fix given the budget."
- **Per component:** Frontend: N · JS/React: N · Backend: N.
- **Where to find everything:** Docsify dashboard URL (http://localhost:3333), report paths, functional report, functional checklist, Jira keys, Confluence link, screenshot/video locations.
- No stack traces or technical details in this summary.

### 10. Slack summary

Post the PM-friendly summary to the configured channel. If Slack MCP not available, skip.

### 11. Output summary (for the agent)

List all artifacts produced:
- `qa-output/` — Docsify dashboard (serve with `npx docsify-cli serve qa-output --port 3333`)
- `qa-output/qa-report-{slug}-{date}.md` — Full technical report
- `qa-output/qa-functional-report.md` — Functional report (PM/client)
- `qa-output/qa-functional-checklist.md` — Functional checklist (PM decision tool)
- `qa-output/qa-fix-list-{slug}-{date}.md` — Fix list
- `qa-output/qa-jira-tickets-{slug}-{date}.md` — Jira ticket content
- `qa-output/qa-confluence-checklist-{slug}-{date}.md` — Confluence checklist
- `qa-output/qa-frontend-report.md` — Frontend subagent report
- `qa-output/qa-backend-report.md` — Backend subagent report
- `qa-output/e2e-flow-report.md` — E2E subagent report
- `qa-output/screenshots/` — Desktop, tablet, mobile screenshots
- `qa-output/videos/` — E2E flow videos
- Jira keys (if created)
- Confluence link (if created)
- Slack confirmation (if posted)

Then show the PM-friendly summary in chat.

## Notes

- Use the QA report format rule for every output.
- **The functional/technical split is the key deliverable for PM communication.** The functional report and checklist must be readable by someone with zero technical knowledge.
- The Docsify template is reusable across projects — don't modify `.cursor/qa-docsify-template/`. Only modify files in `qa-output/`.
- If MCP create fails, still produce markdown and note "Create via MCP failed; use markdown for manual copy."
- The Docsify dashboard is the presentation layer. All content lives in markdown files that work with or without Docsify.
