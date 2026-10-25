# Narrow operator frame design

**Date:** 2026-10-25  
**Repository:** `ahpa5246-lgtm/WATCHED`  
**Branch:** `codex/resilient-settings-and-pause`

## Problem

The inspected 760x900 browser evidence measures roughly 959px in document height. The status bar that communicates shift, controls and local-record state begins below the initial viewport. An operator must scroll the entire document before seeing persistent system state, while the top-level console chrome behaves unlike a contained surveillance terminal.

## User outcome

At the narrow 760x900 viewport:

- the complete top bar and status bar remain inside the initial viewport;
- the surveillance workspace between them remains usable and scrollable when its stacked panels exceed the available height;
- every existing panel remains reachable through that workspace scroll region;
- pause/settings and Continue journeys remain unchanged;
- desktop layout at widths above 980px remains unchanged.

## Constraints

- CSS-only production change; no game, save, timing or translation logic changes.
- Preserve the existing DOM order and all current controls.
- Do not hide the status bar or any working panel to make the assertion pass.
- Keep the PR draft; no merge or deployment.
- Evidence must be bound to the implementation commit and include a real 760x900 Chromium frame.

## Approaches considered

1. **Reduce every panel until the whole document is under 900px.** Rejected. It couples the layout to one height, harms readability, and will fail again when translated copy grows.
2. **Fix the status bar over the document.** Rejected. A fixed overlay can cover controls and makes full-page screenshots ambiguous.
3. **Use a viewport-owned application frame with an internally scrollable console at widths up to 980px.** Selected. The top and status bars remain stable terminal chrome, while the existing console grid owns overflow and keeps all panels reachable.

## Acceptance

A Playwright test starts a real shift in the `narrow-760` project and verifies:

1. the status bar has a real bounding box;
2. its top and bottom are inside the 760x900 viewport;
3. the page itself does not require vertical scrolling;
4. `.console-grid` has internal vertical overflow, proving content was retained rather than hidden;
5. a viewport screenshot is captured after the assertions.

The test is committed and observed failing against the current layout before any production CSS is changed. The minimal implementation is limited to the existing `@media (max-width: 980px)` rules.

## Reference boundary

The already-reviewed official Papers, Please and Beholder product pages remain direct released-product references for persistent operator chrome and task hierarchy. Inkle remains a quality reference for legible narrative interfaces. This bounded repair does not claim the open original-art direction gate is complete and copies no assets, layouts or source.
