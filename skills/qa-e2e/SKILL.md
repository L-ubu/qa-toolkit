---
name: qa-e2e
description: Run E2E/flow QA: critical user journeys at desktop/mobile/tablet viewports, browser automation, record videos, capture screenshots. Tag every finding as Functional or Technical. Use when the user runs a full QA, /qa-e2e, or asks for E2E QA.
---

# QA — E2E / Flows

Run end-to-end QA on critical user journeys, use browser automation at **multiple viewports**, and produce video/screenshot evidence. **Every finding must be tagged with audience** (Functional or Technical).

## Input (from user or orchestrator)

- **App URL** (staging or local). **If only local dev is running (e.g. DDEV at https://jlr-mss.ddev.site), use that.** Responsive testing and E2E flows are still required against local.
- **Critical flows** to cover (e.g. login, main booking flow, checkout) or infer from repo/docs.
- **Exclusions** (flows or paths to skip).

## Steps

1. **Define critical flows**
   - List 3–5 critical journeys (e.g. "Login as user", "Create reservation", "View dashboard").
   - For each: steps (click, fill, submit, expect).

2. **Run flows at multiple viewports — MANDATORY**

   Run each critical flow (or at least the main flow) at three viewports:

   **Desktop (1280px):**
   - Record the **full critical user journey** as video → `qa-output/videos/e2e-flow-desktop.mp4`.
   - Capture screenshots at key steps → `qa-output/screenshots/desktop/e2e-{flow}-{step}.png`.

   **Mobile (375×667):**
   - Run the same flow (or key parts) at mobile viewport.
   - Record video → `qa-output/videos/e2e-flow-mobile.mp4`.
   - Capture screenshots → `qa-output/screenshots/mobile/e2e-{flow}-{step}.png`.
   - Pay special attention to: navigation/hamburger menu, touch targets, horizontal overflow, text readability, modal sizing.

   **Tablet (768×1024):**
   - Run at tablet viewport.
   - Record video → `qa-output/videos/e2e-flow-tablet.mp4`.
   - Capture screenshots → `qa-output/screenshots/tablet/e2e-{flow}-{step}.png`.

   If recording is not possible, document which videos were skipped and why. **Screenshots are still required** even without video.

3. **Identify failures and issues**
   - On failure or unexpected behaviour: note steps, expected vs actual, and the **timestamp or segment** in the recording.
   - Create findings with IDs like `E2E-01`, `E2E-02`.
   - **Evidence:** link to the video file and/or screenshot, and note timestamp (e.g. "See 0:12–0:45 in e2e-flow-desktop.mp4").

   **Audience tagging:**
   - Issues the user would see or experience (broken flow, wrong text, visual bug, confusing behaviour) → **Functional**.
   - Code-level root causes found during flow tracing (missing endpoint, wrong API contract, memory leak, race condition) → **Technical**.
   - If both: tag as **Functional** (the user experiences it). The technical root cause goes in the technical report.

4. **Output**
   - Structured list of findings. Each must include:
     - ID, title, area=E2E, **component** (Frontend / JS/React / Backend as appropriate), **audience** (Functional or Technical), severity, steps, suggestion, evidence.
     - **Functional description** (for Functional findings): 1–2 plain-language sentences about what the user sees. No file paths.
   - **Video list:** E2E flow desktop, mobile, tablet. Paths for each.
   - **Screenshot list:** Paths for all captured screenshots, organized by viewport.

## Notes

- Use the QA report format rule for every finding. **Audience tag is mandatory.**
- **Responsive testing is mandatory** even with only a local dev URL. The PM needs to see how the site behaves at different screen sizes.
- Deliver at least: **one E2E flow video** (desktop), **mobile viewport video**, **tablet viewport video**. If only screenshots are possible, deliver those.
- If Playwright or recording is not available, document which are missing and output findings; suggest manual recording.
- **Project-specific (e.g. JLR MSS):** If the repo has `.cursor/qa-reference/jlr-qa-structure.md`, prioritise critical flows from that file. Tag findings with **feature** and **layer**.
