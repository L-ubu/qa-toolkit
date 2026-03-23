# Functional QA Report — {{PROJECT_NAME}}

> **For:** Project Manager, Client, Non-technical stakeholders
> **Date:** {{DATE}} · **Branch:** `{{BRANCH}}`

This report covers **what users see and experience** on the website. No code references — just plain descriptions of what's wrong, where it happens, and how important it is.

---

## How to Read This Report

- <span class="badge-p0">P0 — Critical</span> The user cannot complete an important action, or something is seriously broken/missing. Fix before launch.
- <span class="badge-p1">P1 — High</span> Something clearly doesn't work right or looks wrong. Users will notice and may get confused or stuck.
- <span class="badge-p2">P2 — Medium</span> A smaller issue that's noticeable but doesn't block the user. Fix when budget allows.
- <span class="badge-p3">P3 — Low</span> Polish items. Nice to fix but won't hurt the user experience much.

> **Budget tip:** Focus on P0 and P1 first. P2 items marked "visual" are often quick wins. P3 can wait for a future sprint.

---

## Summary

- **Total user-facing issues: {{FUNCTIONAL_COUNT}}**
- Critical (P0): {{FUNC_P0}} · High (P1): {{FUNC_P1}} · Medium (P2): {{FUNC_P2}} · Low (P3): {{FUNC_P3}}

---

{{FUNCTIONAL_FINDINGS}}

---

## Screenshots

See the [Screenshots & Videos](media.md) page for visual evidence at desktop, tablet, and mobile sizes.

---

*This is the non-technical companion to the [full technical QA report](qa-report-{{PROJECT_SLUG}}-{{DATE}}.md). For code-level details and fix instructions, share the technical report with the development team.*
