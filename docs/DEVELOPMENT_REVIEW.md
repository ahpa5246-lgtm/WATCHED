# WATCHED: engineering review, 2026-10-18

## Scope and intent
Owner requested continued implementation and severe comparison with released products. This is the first bounded repair milestone, not a full completion claim. Local/offline architecture is retained; no new paid service or deployment.

Core journey: New shift → surveillance → pause/settings → resume → save/continue.

## Decision and implementation
Preserve prior paused state when opening/closing settings; validate stored language, volume and accessibility preferences and report failed setting persistence without crashing the control. Keep the focused surveillance console: splitting its simultaneous camera/subject information arbitrarily would harm play.

Alternative: decorate the existing home page while leaving workflows and state bugs unchanged. Rejected because appearance cannot repair lost results or crowded controls. Existing architecture remains intact.

## Reference research
Official feature/product pages consulted for task hierarchy and separation of primary work from setup/reference. No source, artwork, icon or layout copied:
https://papersplea.se/
https://store.steampowered.com/app/475550/Beholder/
https://www.inklestudios.com/

Web-text inspection is not a visual screenshot comparison. These sources are a starting shortlist, not completed visual evidence. Do not mark the comparative design gate passed. A missing or inaccessible visual reference remains an open item.

## Evidence and harsh self-review
6 Node tests and production build pass. Browser journey pending until headless Chromium is available. Game art, keyboard accessibility and full six-shift balancing remain unfinished.

The Senior Skills example visual gate was run and correctly returned BLOCKED_UNVERIFIED_DESIGN; its draft lacks verified asset licenses. That result is framework evidence, not a project-specific visual pass. Actual screenshots, app-commit binding, keyboard/RTL checks, and task observations are required before release readiness.

## Next acceptance boundary
Exercise pause→settings→close→resume and corrupt storage in the browser. Then improve scenes and progression using original art, not copied commercial assets.

Rollback: revert this milestone branch before merge. Do not merge or deploy automatically. Future runs must inspect open PRs and continue this branch before creating duplicate work.
