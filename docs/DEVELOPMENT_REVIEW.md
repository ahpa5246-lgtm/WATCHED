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

The desktop evidence keeps the surveillance monitor, camera bank, subject panel and log visible in one operational workspace without modal overlap. The narrow operator-frame milestone now makes the 760×900 application shell own the viewport: the top and status bars remain visible while the stacked console owns vertical overflow. The inspected top position shows all six camera controls without clipping, and the browser assertion scrolls the console to prove the bottom event log is reachable.

The narrow acceptance followed a multi-step RED→GREEN investigation. Test-only run 40149663327 passed syntax, all 10 Node tests, the production build and all six existing browser journeys, then failed the new assertion because the status bar ended at 974.9375px in a 900px viewport. Initial CSS run 40152187734 moved the status bar inside the viewport but failed because the console reported no internal overflow (794px scroll height and 794px client height); its screenshot exposed the bottom camera row being clipped. Diagnostic run 40158605211 repeated that exact failure after a container-level intrinsic-height attempt, confirming that the responsive grid rows themselves were still shrinking.

GREEN run 40159155582 on implementation commit `c714184d0aa0e3a9d3c00364313c043c16ab8fb4` passed syntax checks, all 10 Node tests, the production build, Chromium installation and the browser suite: seven journeys passed and the desktop-only copy of the narrow acceptance was intentionally skipped. Artifact 12585514554 (`browser-evidence-4cd1f2f17db59ffbbd4e0e812b364a628859935d`, 495,541 bytes, SHA-256 `a06501aee313553ec75dcedc911784bc6ec636cfed87a8bb4419650d667b9e7b`) is bound by workflow metadata to the implementation commit and contains five screenshots. The narrow frame and desktop resumed-session screenshots were inspected: the narrow camera bank is complete, the fixed chrome does not cover it, and the desktop structure is unchanged.

This milestone does not close the visual-quality gate. The feed still looks like a diagnostic prototype: generic stick figures and boxes carry almost no environmental story, the gray scanlined feed has weak focal contrast, and the subject/camera panels rely on sparse text instead of purposeful visual information. These are open quality defects, not accepted polish.

The Senior Skills example visual gate was run and correctly returned BLOCKED_UNVERIFIED_DESIGN; its draft lacks verified asset licenses. That result is framework evidence, not a project-specific visual pass. Actual screenshots, app-commit binding, keyboard/RTL checks, and task observations are required before release readiness.

## Next acceptance boundary
Commission and approve an original scene/character art direction before changing the surveillance visuals, then improve one playable scene without copying commercial assets. Preserve the now-verified pause/settings, Continue and viewport-owned narrow-console journeys and capture new desktop/narrow evidence. Keyboard navigation, Arabic/RTL browser coverage and complete six-shift balancing remain separate work.

Rollback: revert this milestone branch before merge. Do not merge or deploy automatically. Future runs must inspect open PRs and continue this branch before creating duplicate work.

## 2026-10-31 — current browser evidence and competitive visual review

### Bound implementation evidence
The current branch-head browser artifact is [12586944105](https://github.com/ahpa5246-lgtm/WATCHED/actions/runs/40163649057/artifacts/12586944105), SHA-256 `32be8a226bd654e1a7408caac4f981a1c6564d8d34ecaefdf134d481b54c6294`, bound to commit `b9e8e0aaf1404f8f1a75a80de50ccc226bf770d1`. The five desktop/narrow screenshots were inspected. The desktop console keeps the camera feed, camera bank, subject panel, and event log visible; the 760×900 frame keeps the top/status bars visible and moves the stacked console into its own vertical overflow. The screenshots confirm layout and reachability, not the quality of the scene art.

### Published-product comparison — 2026-10-31
- [Papers, Please](https://papersplea.se/) — direct released inspection-workflow reference. Its official desktop screenshot gives the operator a concrete portrait, document stack, decision stamps, and a clear desk surface. WATCHED's feed currently has two generic stick figures and geometric room blocks; the operator has less environmental context and weaker visual focal points.
- [Beholder](https://store.steampowered.com/app/475550/Beholder/) — direct released surveillance/tenant-management reference. Its official product description grounds surveillance in apartment occupants, evidence gathering, profiling, and consequential reporting. The current WATCHED screen exposes camera and subject controls but the environment still reads as a diagnostic placeholder. Steam's linked gallery images were not retrievable in this inspection, so this is a task-level comparison, not a completed screenshot-to-screenshot comparison.
- [inkle](https://www.inklestudios.com/) — official narrative-design reference. Its published portfolio separates story worlds and interactive narrative products rather than treating all narrative information as one generic dashboard. Use this only to inform scene/story hierarchy; no art, characters, or layout are copied.

### Confirmed gaps
The scene feed remains the dominant visual defect: generic silhouettes, rectangular scenery, a uniform gray scanline treatment, and little contextual evidence. The subject panel's empty state is structurally clear, but its visual weight competes with the feed when no subject is selected. The product comparison does not justify adding decoration or rearranging the console arbitrarily. A distinct original scene/character art direction still requires owner approval before scene artwork changes.

### Gate status
The existing Playwright evidence verifies pause → settings → close → paused → explicit resume, save → exit → reload → Continue, corrupt-save fallback, and desktop/narrow viewport reachability. It does not verify Arabic/RTL, complete keyboard-only operation, six-shift balance, or a fully art-directed scene. The comparative visual gate remains BLOCKED; no release-readiness claim is made.

## 2026-10-31 — browser-storage failure containment

### Defect and scope
The save validator rejected malformed records, but the application still accessed `localStorage` directly in startup detection, continuation, new-game cleanup, end-of-game cleanup and reset. A denied storage getter or a failing storage operation could therefore abort startup or an operator action. This is a persistence-availability defect, not a simulation-state defect.

### Bounded implementation
Added a small safe-storage adapter that distinguishes a missing key from unavailable storage and contains getter/read/write/remove exceptions. Save and settings failures remain visible in the existing status line. A failed progress reset now stops before resetting the in-memory session, so the UI does not imply that a persisted record was removed when removal failed. The application remains playable in memory when persistence is unavailable; it does not claim that progress can be restored.

### Acceptance evidence
Added unit coverage for missing keys, normal read/write/remove, a throwing storage getter, and throwing storage methods. Added a real-browser journey that denies Storage API operations and checks startup, New Shift, Begin, save-failure status, pause/settings access and reset-failure status. Remote CI and screenshot inspection are pending; no pass is claimed for this commit until the branch-head workflow and browser artifact are checked.

### Remaining limitations
When browser storage is blocked or full, settings and progress cannot persist. The app can continue in the current page session, but a reload loses unsaved progress. The scene-art direction, Arabic/RTL browser journey, complete keyboard-only audit and six-shift balance remain separate open gates.
