# WATCHED: engineering review, 2026-10-18

## Scope and intent
Owner requested continued implementation and severe comparison with released products. This is the first bounded repair milestone, not a full completion claim. Local/offline architecture is retained; no new paid service or deployment.

Core journey: New shift → surveillance → pause/settings → resume → save/continue.

## Decision and implementation
Preserve prior paused state when opening/closing settings; validate stored language, volume and accessibility preferences and report failed setting persistence without crashing the control. The continuation milestone now validates the full saved-record envelope before showing or loading Continue: malformed JSON, unsupported versions, completed runs, impossible progress values and invalid nested collection shapes fall back to New Shift instead of silently opening a fresh or unstable simulation. The follow-up guard also rejects unknown selected subjects, out-of-range subject/zone/stat metrics, non-boolean absence flags and malformed event-state flags, preventing corrupted local data from silently changing simulation behavior. Valid records retain elapsed progress while transient pause/focus state is cleared on restore. Keep the focused surveillance console: splitting its simultaneous camera/subject information arbitrarily would harm play.

Alternative: decorate the existing home page while leaving workflows and state bugs unchanged. Rejected because appearance cannot repair lost results or crowded controls. Existing architecture remains intact.

## Reference research
Official feature/product pages consulted for task hierarchy and separation of primary work from setup/reference. No source, artwork, icon or layout copied:
https://papersplea.se/
https://store.steampowered.com/app/475550/Beholder/
https://www.inklestudios.com/

Web-text inspection is not a visual screenshot comparison. These sources are a starting shortlist, not completed visual evidence. Do not mark the comparative design gate passed. A missing or inaccessible visual reference remains an open item.

On 2026-10-19, the official Papers, Please site and the official Steam product pages for Papers, Please and Beholder were checked again, and both released products' official store hero art was visually inspected. Their art establishes a specific world through cohesive character silhouettes, architecture, typography and color before the operator reaches the controls. The current WATCHED evidence instead exposes generic stick figures, rectangular scenery and a nearly uniform gray camera feed. This is a confirmed art-direction gap. Store hero art is promotional reference rather than gameplay-layout evidence, so this comparison does not pass the full visual gate or license any copying.

## Evidence and harsh self-review
10 Node tests and production build pass locally. Four save-record cases cover valid continuation, malformed/unsupported/completed records, impossible progress shapes and values outside the simulation domains. The new domain test was confirmed RED against the prior validator because an unknown selected subject was accepted, then GREEN after the bounded validation change. GitHub Actions run 39092781344 independently passed syntax checks, all 10 tests (0 failures), and the production build on commit `8a2428a`; the build produced `dist/` with zero runtime dependencies. The run also reported GitHub's Node 20 action-runtime deprecation warning for `actions/checkout@v4` and `actions/setup-node@v4`, which is a maintenance item rather than a product-test failure.

The browser-journey stage followed a remote RED→GREEN cycle because the local Chromium archive was blocked by the execution environment. Test-only run 39176037246 passed the existing 10 Node tests, production build and four valid/corrupt Continue journeys, then failed at both 1280×900 and 760×900 exactly because the paused overlay exposed no Settings action. The bounded implementation adds that action, hides the pause overlay while Settings is open, restores the paused overlay on close and only resumes when the operator explicitly chooses Resume.

Implementation run 39176221093 passed syntax checks, all 10 Node tests, the production build, Chromium installation and all six Playwright journeys at 1280×900 and 760×900. The tests exercise pause → settings → close → paused → resume, valid save → exit → reload → Continue, and corrupt-save fallback. Artifact 12153934614 (`browser-evidence-d6be4efecd0857ca4e84e0642dd0b032d7254c26`, 439,028 bytes, SHA-256 `befbc1e2c6d7ef8dda933fee9dfa85c8f521481d2cf30599bc2007a26c37e46f`) retains the Playwright report and four full-page screenshots; all four screenshots were inspected.

The desktop evidence keeps the surveillance monitor, camera bank, subject panel and log visible in one operational workspace without modal overlap. At 760×900 the core monitor and all working panels stack coherently, but the full page measures roughly 959px tall, leaving the status bar just below the initial viewport. More importantly, the inspected feed still looks like a diagnostic prototype: generic stick figures and boxes carry almost no environmental story, the gray scanlined feed has weak focal contrast, and the subject/camera panels rely on sparse text instead of purposeful visual information. These are open quality defects, not accepted polish.

The Senior Skills example visual gate was run and correctly returned BLOCKED_UNVERIFIED_DESIGN; its draft lacks verified asset licenses. That result is framework evidence, not a project-specific visual pass. Actual screenshots, app-commit binding, keyboard/RTL checks, and task observations are required before release readiness.

## Next acceptance boundary
Commission and approve an original scene/character art direction before changing the surveillance visuals, then improve one playable scene without copying commercial assets. Preserve the now-verified pause/settings and Continue journeys, capture new desktop/narrow evidence, and include the 760×900 below-fold status bar in the acceptance review. Keyboard navigation, Arabic/RTL browser coverage and complete six-shift balancing remain separate work.

Rollback: revert this milestone branch before merge. Do not merge or deploy automatically. Future runs must inspect open PRs and continue this branch before creating duplicate work.

