# Narrow Operator Frame Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Keep WATCHED's narrow status bar in the initial viewport while preserving access to the complete stacked surveillance workspace.

**Architecture:** At widths up to 980px, the application shell owns the viewport height and the existing console grid owns vertical overflow between unchanged top and status bars. The change is CSS-only and is proved with a real Chromium geometry assertion before implementation.

**Tech Stack:** HTML, CSS, Playwright 1.64.1, GitHub Actions

**Spec:** `docs/superpowers/specs/2026-10-25-narrow-operator-frame-design.md`

## Global Constraints

- Keep `codex/resilient-settings-and-pause` and PR #2; do not create duplicate work.
- No JavaScript, save-state, simulation, translation, dependency, merge or deployment changes.
- Production CSS follows an observed Playwright RED.
- Desktop widths above 980px remain unchanged.
- All content panels remain reachable; no hiding or clipping content to satisfy geometry.
- Record exact CI and screenshot-artifact evidence in `docs/DEVELOPMENT_REVIEW.md`.

## Review Focus

- A 760x900 shift keeps the full status bar inside the viewport.
- The document itself does not gain vertical overflow at the target viewport.
- The console grid becomes the scroll owner when its stacked content is taller than its available area.
- The bottom event log remains reachable by scrolling the console grid.
- Existing pause/settings, valid Continue and corrupt-save journeys remain green.

---

### Task 1: Narrow viewport-owned console frame

**Files:**
- Modify: `tests/browser/operator-journeys.spec.mjs`
- Modify: `src/style.css`
- Modify: `docs/DEVELOPMENT_REVIEW.md`

**Interfaces:**
- Consumes: existing `.app-shell`, `.console-grid`, `.topbar` and `.statusbar` layout contracts.
- Produces: at `max-width: 980px`, a viewport-height shell whose console grid owns vertical overflow.

- [ ] **Step 1: Write the failing browser acceptance test**

Add `narrow status remains visible while console content stays reachable`. Run it only for `narrow-760`. Start a real shift, assert the status bar bounding box is fully inside the viewport, assert document `scrollHeight <= clientHeight`, assert console `scrollHeight > clientHeight`, scroll the console to its maximum, assert the event log is visible, restore scroll position, and capture `narrow-operator-frame.png`.

- [ ] **Step 2: Verify RED remotely**

Run: GitHub Actions CI on the test-only commit.  
Expected: syntax checks, 10 Node tests, build and the six existing journeys pass; the new narrow frame assertion fails because the status bar ends below 900px and the document owns vertical overflow.

- [ ] **Step 3: Implement the minimal responsive CSS**

Inside the existing `@media (max-width: 980px)` block, constrain `.app-shell` to the viewport with `height: 100vh`, `min-height: 0` and `overflow: hidden`; give `.console-grid` `overflow-y: auto`; keep `.statusbar` as a non-shrinking flex child. Do not alter desktop rules or hide panels.

- [ ] **Step 4: Verify GREEN**

Run: GitHub Actions CI.  
Expected: syntax checks, all 10 Node tests, production build, Chromium install, all six existing journeys and the new narrow acceptance pass; screenshot artifact uploads.

- [ ] **Step 5: Inspect evidence and document limitations**

Inspect desktop/narrow evidence, bind artifact metadata to the implementation commit, record RED and GREEN run IDs, measurements, remaining original-art/keyboard/RTL/balancing gaps, and confirm PR #2 remains open, draft and unmerged.

- [ ] **Step 6: Commit**

Commit test, CSS and evidence documentation as separate bounded commits on the existing branch.
