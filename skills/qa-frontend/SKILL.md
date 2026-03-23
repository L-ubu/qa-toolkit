---
name: qa-frontend
description: Run Frontend/UI QA: Storybook coverage, visual checks, responsive behaviour with screenshots, component consistency. Tag every finding as Functional or Technical. Use when the user runs a full QA, /qa-frontend, or asks for frontend-only QA.
---

# QA — Frontend / UI

Run frontend-focused QA and output findings in the shared QA report format. **Every finding must be tagged with audience** (Functional or Technical).

## Input (from user or orchestrator)

- **Repo path** (and optional branch).
- **Storybook URL** or path (e.g. local `npm run storybook` or deployed URL).
- **Staging or app URL** (if available). **If only local dev is available (e.g. DDEV at https://jlr-mss.ddev.site), use that** — responsive testing is still required.
- **Exclusions** (paths to skip).

## Steps

1. **Identify frontend surface**
   - List React/UI entry points (e.g. `src/`, theme folder).
   - Locate Storybook config and stories (e.g. `*.stories.tsx`).

2. **Storybook**
   - If Storybook is available (URL or run locally): list all story IDs; note components without stories.
   - Open a sample of stories; check for layout breaks, missing props, console errors.
   - Output findings with IDs like `FE-01`, `FE-02`.

3. **Visual / responsive — MANDATORY even with local dev only**
   - Check key pages at **mobile** (375px), **tablet** (768px), **desktop** (1280px), and optionally 320px.
   - **Use Playwright or browser automation** to open the local dev URL at each viewport.
   - Note overflow, broken layout, touch targets, text truncation, horizontal scroll, z-index issues, visual regressions.
   
   **Screenshots (required):**
   - Capture screenshots of key pages/components at each viewport.
   - Save to: `qa-output/screenshots/desktop/`, `qa-output/screenshots/tablet/`, `qa-output/screenshots/mobile/`.
   - Naming: `{page-or-component}-{viewport}.png` (e.g. `homepage-desktop.png`, `checkout-mobile.png`).
   - Aim for at least 3–5 screenshots per viewport covering the main pages.
   
   **Videos (when possible):**
   - Record short clips for responsive behaviour: one for mobile, one for tablet, one for desktop or combined.
   - Save to `qa-output/videos/` (e.g. `frontend-responsive-mobile.mp4`).
   - If recording not possible, document viewport results in findings and note "video not recorded".

   **Audience tagging:**
   - Visual/layout/responsive bugs → **Functional** (user sees them).
   - Code-level issues found during visual review (e.g. wrong CSS approach, missing component variant) → **Technical**.

4. **Component consistency**
   - Scan for repeated patterns (buttons, forms, cards); note deviations or missing variants.
   - Optional: compare to design tokens or theme (if documented).

5. **Output**
   - Structured list of findings. Each must include:
     - ID, title, area=Frontend, **component** (Frontend or JS/React), **audience** (Functional or Technical), severity, steps, expected/actual, suggestion, evidence.
     - **Functional description** (for Functional findings): 1–2 plain-language sentences about what the user sees. No file paths.
   - List all **screenshot paths** produced (desktop/tablet/mobile).
   - List any **video paths** produced.
   - Do not merge with backend/E2E findings; the orchestrator will combine them.

## Notes

- Use the QA report format rule for every finding. **Audience tag is mandatory.**
- Tag findings: **Functional** = user sees it (visual bug, wrong text, broken interaction, layout issue). **Technical** = only a dev would find it (code smell, wrong approach, missing test coverage).
- Prefer P1/P2 for user-visible issues; P3 for polish.
- **Responsive screenshots are required** even with only a local dev URL. The PM needs visual evidence at all viewports.
- If Storybook or URLs are missing, say so and skip those steps.
- **Project-specific (e.g. JLR MSS):** If the repo has `.cursor/qa-reference/jlr-qa-structure.md`, tag findings with **layer** and **feature**.
