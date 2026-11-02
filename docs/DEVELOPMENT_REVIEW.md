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


## 2026-10-31 — keyboard-contained dialogs and Arabic settings

### User journeys exercised
The keyboard-only acceptance now covers:
- New Shift → briefing → Begin, including focus placement on the only valid next action
- active session → Escape → Pause → Settings → Arabic language selection → forward Tab traversal through every settings control → Escape → return focus to the Settings trigger
- Pause → Resume, and Pause → Save & Exit → Continue after a persisted local save

The same browser test runs at 1280×900 and 760×900. It asserts dialog semantics, aria-modal, the inert/hidden application shell, initial focus, forward and reverse focus containment, restoration to the initiating control, the RTL document direction, and the real keyboard path back into the saved session.

### Bounded implementation
All five overlays now expose named role=dialog surfaces with aria-modal=true. Opening an overlay moves focus to its first actionable control, makes the background application inert and aria-hidden, and contains Tab/Shift+Tab within the active dialog. Closing Settings restores focus to the exact control that opened it; closing Pause/Briefing/Continue returns focus to the active operator control. Escape is handled before the editable-control shortcut guard, so a focused language selector no longer traps the operator inside Settings.

The native select initially exposed a test-order issue when the test attempted reverse traversal immediately after changing its option. The browser test was changed to traverse every settings control forward and verify wraparound. A subsequent RED run exposed a real defect: Escape was ignored while the select had focus because the global handler returned early for form controls. That guard was moved after Escape handling.

### CI and browser evidence
- Implementation commit: b914157ea1ec09e5a962c20f68f7289280deff46
- GREEN PR run: https://github.com/ahpa5246-lgtm/WATCHED/actions/runs/41240937206
- GREEN push run: https://github.com/ahpa5246-lgtm/WATCHED/actions/runs/41240932295
- npm ci, syntax checks, npm test (13/13), production build (zero runtime dependencies), Chromium installation and Playwright all passed.
- Browser result: 11 passed, 1 intentional desktop skip (the narrow-only viewport assertion).
- Artifact: https://github.com/ahpa5246-lgtm/WATCHED/actions/runs/41240937206/artifacts/13057293093, 588,898 bytes, SHA-256 67f705a25d67b2cc008209cd8d3c5d26cc4e0e3df2795a8d7b2f7196f8f2ef39. Desktop and 760×900 Arabic settings screenshots, resumed-session screenshots, and the narrow operator-frame screenshot were inspected.
- RED runs https://github.com/ahpa5246-lgtm/WATCHED/actions/runs/41240651177 and https://github.com/ahpa5246-lgtm/WATCHED/actions/runs/41240783115 are retained as test-development evidence; the latter identified the Escape/form-control defect fixed in the GREEN commit.

### Comparative recheck — 2026-10-31
- Papers, Please — official product site: https://papersplea.se/ . The released desktop/mobile game and the browser-based LCD, Please inspector tool provide a direct task-flow reference for focused inspection and consequential decisions. Its desk/document workflow is not a reason to turn WATCHED into a document-processing screen.
- Beholder — official Steam product page: https://store.steampowered.com/app/475550/Beholder . The released surveillance narrative grounds observation in identifiable tenants, evidence gathering and reporting consequences. It remains the closer thematic comparator; its narrative/environmental context is stronger than WATCHED's current diagnostic camera feed.
- inkle — official studio and product portfolio: https://www.inklestudios.com/ . The interactive-story portfolio and ink scripting language remain an aspirational reference for readable narrative hierarchy, not a surveillance-console layout to copy.
- Decision: retain the single simultaneous surveillance workspace; this milestone improves dialog semantics and keyboard state transitions without splitting the camera/subject/log task or changing scene artwork. No competitor source, art, icon or layout was copied.

This is a task-level comparison, not a completed screenshot-to-screenshot visual parity review. The current app screenshots still show generic stick figures, rectangular scenery, weak focal contrast and sparse subject information. The original scene/character art direction still requires owner approval. The previous Senior Skills visual gate result remains BLOCKED_UNVERIFIED_DESIGN; this run did not re-run scripts/visual_quality_gate.py because the local container could not reach GitHub to obtain a checkout. No visual-gate pass is claimed.

### Remaining verification
- Manual screen-reader testing (NVDA/VoiceOver) is not performed; automated browser focus tests do not establish WCAG conformance.
- The camera/subject selection journey now passes with keyboard at 1280×900 and 760×900. 320px reflow/zoom, mixed-direction identifiers and the complete six-shift balance remain open.
- The scene-art direction and full visual comparison gate remain open; this accessibility milestone does not close them.

Rollback: revert the keyboard-dialog implementation commit and this review entry on the existing PR branch. No merge or deployment.


## 2026-11-01 — keyboard-only camera and subject inspection

### User journey exercised
New Shift → briefing → Begin → Settings → Arabic language → close Settings → move through the camera controls with Tab → activate CAM 02 with Enter → continue through the camera buttons → select a visible subject with the native subject picker and ArrowDown → move to Focus with Tab → activate focused observation with E. The same journey runs in the 1280×900 desktop and 760×900 narrow Playwright projects. No canvas pointer input is used.

### Bounded implementation
- Camera controls expose their selected state through `aria-pressed`.
- Rebuilding camera buttons after a camera change or UI refresh restores focus to the same camera control instead of returning the operator to the document body.
- A labeled native subject selector lists only the currently visible subjects for the selected camera. It refreshes when camera, language or visible-subject membership changes, and remains synchronized with canvas selection.
- The focus toggle exposes its state through `aria-pressed`. English and Arabic labels/hints explain the list-based selection path.

This keeps camera, subject and system-log inspection in one operator workspace: those controls serve the same continuous observation task. Settings and pause remain separate modal journeys. The change does not attempt to imitate a document desk or narrative apartment interface.

### CI and actual browser evidence
- Implementation commits on the existing branch: `ced0b880`, `bdc9395f`, `51473370`, `c9768202`, `e571c159`, `f2bebda9`, `39c56e10`, `fb4beea5`.
- Final PR run: https://github.com/ahpa5246-lgtm/WATCHED/actions/runs/41299487640 — all jobs passed.
- `npm ci`, JavaScript syntax checks, `npm test` (13/13), production build, Chromium installation and Playwright all passed; browser result: 13 passed.
- Artifact: https://github.com/ahpa5246-lgtm/WATCHED/actions/runs/41299487640/artifacts/13080562960, 770,269 bytes, SHA-256 `074e6b43f5966a746e297082ff432ec720c27ff0b2677bf7cfbc1bd16f54bae4`. Desktop and narrow screenshots were opened and inspected. They show the selected camera retained after Enter, the Arabic subject picker, selected subject details, and the focused observation control. At 760×900 the camera/subject panels reflow below the feed without clipping the picker or action buttons.
- Two earlier RED runs were used to correct the test sequence, not to mask a product failure: run 41299019753 exposed an off-by-one Tab count (focus was on CAM 05); run 41299256264 showed that the test's extra Enter did not advance focus out of the native select as expected. The final test uses ArrowDown to commit the native option, then Tab to reach the Focus action. The final GREEN run is 41299487640.

### Published-product comparison — 2026-11-01
- Papers, Please — official product site: https://papersplea.se/ . Its desk/document review flow is a useful direct reference for a single high-consequence inspection task and compact status hierarchy; it is not a reason to turn WATCHED into a paperwork interface.
- Beholder — official Steam product page and released-game screenshot gallery: https://store.steampowered.com/app/475550/Beholder and https://steamcommunity.com/app/475550/screenshots/ . Its apartment scenes give subjects a distinct environment and narrative context. The current WATCHED feed remains more abstract and less legible because the figures and rooms are generic; this keyboard milestone does not resolve the scene-art gap.
- inkle — official studio and product portfolio: https://www.inklestudios.com/ . Retained as an aspirational reference for readable narrative hierarchy, not as a direct surveillance-interface competitor.
- Decision: keep one simultaneous camera/subject/log workspace because these are parts of one observation task; keep settings and pause separate. Improve the task's keyboard path without copying competitor art or layout.

This is a dated task-level comparison, not a complete screenshot-to-screenshot visual parity pass. The Senior Skills visual gate remains BLOCKED_UNVERIFIED_DESIGN; the gate script was not run in this environment because a local repository checkout is unavailable and the container cannot resolve GitHub. No visual-gate pass or WCAG conformance claim is made.

### Remaining verification
- Manual NVDA/VoiceOver testing remains outstanding.
- Verify 320px reflow and 200% zoom, mixed-direction identifiers, and the full six-shift balance.
- The generic stick-figure scene art, weak room context and sparse subject evidence still need a separate original art-direction milestone and actual visual-gate review.

Rollback: revert the eight implementation commits above on this existing PR branch. No merge or deployment.


## 2026-11-01 — 320px Arabic operator reflow acceptance

### Bounded test
- Added one real-browser acceptance journey to the existing PR #2 branch; no new branch or PR was created.
- The journey starts at a 320×720 viewport, switches the actual app to Arabic/RTL, starts a shift, checks that document width does not exceed the viewport, and verifies the top/status bars remain within the viewport.
- It then uses keyboard focus and Enter to switch to CAM 02, ArrowDown to select the visible subject Aya from the native picker, and the E shortcut to activate focused observation. It asserts the selected camera, subject identity, and focus state from the live UI rather than only checking that controls exist.
- The test is run once under the existing `narrow-760` project after resizing to 320×720; the desktop project skips this narrow-only case intentionally.

### Current-head CI and screenshot evidence
- Test commit: `dc95fa832e84451f8c7fd3704d852cb0a0e7cc9c`.
- GitHub Actions run [41321283240](https://github.com/ahpa5246-lgtm/WATCHED/actions/runs/41321283240) completed successfully on that exact PR head.
- `npm ci`: found 0 vulnerabilities. JavaScript syntax checks and production build passed. Node suite: 13 passed, 0 failed, 0 skipped. Playwright: 14 passed, 2 intentional project skips.
- Artifact [13089641870](https://github.com/ahpa5246-lgtm/WATCHED/actions/runs/41321283240/artifacts/13089641870), 808,453 bytes, SHA-256 `841ca15b49af621294b8941716233c54e887136df15beeeb5b81724297188f66`, is bound to the tested PR head.
- Downloaded and inspected `320-rtl-operator-frame.png` (320×720). It shows the camera grid, Arabic visible-subject picker, selected subject metrics and Focus/Flag controls reachable in the internally scrolling console while the top bar and persistent status bar remain visible. The test measured no horizontal document overflow.
- The same artifact retains the desktop/narrow keyboard camera-selection, Arabic settings, resumed-session, continued-session and narrow operator-frame screenshots. The earlier 1280×900 and 760×900 journeys remain green.

### Design and scope decision
- The existing released-product comparison remains [Papers, Please](https://papersplea.se/) for a focused high-consequence inspection task, [Beholder](https://store.steampowered.com/app/475550/Beholder) for surveillance subjects grounded in distinct environments, and [inkle](https://www.inklestudios.com/) as an aspirational narrative-hierarchy reference. No art, source, icon or layout was copied.
- Decision: preserve the single simultaneous camera/subject/log workspace, and keep settings/pause as separate modal journeys. At 320px the monitor is not forced to fit beside the operator panels; the console scrolls internally so the subject controls remain reachable without hiding the persistent status bar.
- This is responsive/interaction evidence, not a complete visual-parity or WCAG-conformance pass.

### Remaining gaps
- 200% zoom, manual NVDA/VoiceOver speech output, mixed-direction identifiers, full six-shift balance and the broader game-flow study remain unverified.
- The procedural stick-figure feed still lacks distinct environmental context and subject evidence. A new original art direction remains a separate owner-level product decision; this technical viewport milestone does not resolve it.
- GitHub reports the existing Node 20-targeting Actions versions are being forced to Node 24. This is a CI-maintenance warning, not a failed application check; update action versions in a separate dependency-maintenance milestone.
- Keep PR #2 Draft. No merge or deployment.

Rollback: revert the 320px acceptance-test commit and this review entry on the existing branch.

## 2026-11-01 — announce operator state to assistive technology

### User journey exercised
New Shift → Begin → switch to CAM 02 → select visible subject Aya → enable focused observation → Pause → Settings → switch to Arabic → close Settings → Resume → enable focus again. The status is also checked on the existing keyboard-only camera/subject journey and the 320×720 Arabic reflow journey.

### Bounded implementation
- Added one visually-hidden `role="status"` region with `aria-live="polite"` and `aria-atomic="true"` beside the operator controls.
- The existing UI now announces camera changes, the current subject and ID, no-selection/no-visible-subject states, and focused-observation on/off state in English and Arabic.
- Announcements are emitted from actual user-action paths (camera selection, subject selection, focus, resume and return from Settings), not from the animation frame loop. The live region avoids repeated speech while the scene updates.
- No simulation rules, shift balance, save schema, camera art, or external dependencies changed.

### Current-head CI and browser evidence
- Implementation/test commit: `bf27cafaf99143f765a60c343cfc46cc18b80198`.
- GitHub Actions run [41348950248](https://github.com/ahpa5246-lgtm/WATCHED/actions/runs/41348950248) passed on that exact PR head.
- `npm ci`: 0 vulnerabilities. JavaScript syntax checks passed. Node suite: 13/13 passed. Production build passed.
- Playwright: 16 passed, 2 intentional project skips across the existing desktop 1280×900 and narrow 760×900 projects. The existing 320×720 Arabic reflow acceptance still runs within the narrow project.
- New assertions verify the status role/live/atomic contract and the actual English and Arabic text after camera, subject, focus, pause, settings, and resume actions. The existing keyboard-only journey verifies the same announcement after ArrowDown selection and the `E` shortcut.
- Artifact [13100462139](https://github.com/ahpa5246-lgtm/WATCHED/actions/runs/41348950248/artifacts/13100462139), 785,982 bytes, archive SHA-256 `5a073dd9545d3e64864dce6ff822f94ba7ad181b587eecc993efa1643742305e`. The 760px keyboard-selection and 320×720 Arabic screenshots were downloaded and inspected; the status itself is visually hidden, so its actual announcement content is verified through the browser DOM/ARIA assertions rather than a visible screenshot.

### Comparative recheck and scope decision
- The existing released-product comparison remains [Papers, Please](https://papersplea.se/) for focused inspection and consequential decisions, [Beholder](https://store.steampowered.com/app/475550/Beholder) for subjects grounded in identifiable environments, and [inkle](https://www.inklestudios.com/) as an aspirational narrative-hierarchy reference.
- This milestone addresses an accessibility gap in the operator's existing camera/subject/focus journey. It does not split that continuous workspace, redesign the scene art, or claim parity with the narrative/environmental context of Beholder. No competitor art, source, icons, or layout were copied.

### Remaining verification
- Automated DOM assertions do not prove actual speech output. Manual NVDA/VoiceOver testing remains outstanding.
- 200% zoom, mixed-direction identifiers, complete six-shift balance, and the full visual-parity gate remain unverified.
- Generic stick-figure scenes and weak room context still require a separate original art-direction decision. This owner-level visual decision is not inferred from the current accessibility authorization.
- Keep PR #2 Draft. No merge or deployment.

Rollback: revert `bf27caf` and this review entry on the existing branch.


## 2026-11-02 — isolate subject identifiers in Arabic operator views

### Observed task and bounded repair
The existing 320×720 Arabic operator journey selected subject Aya with identifier `S-203`. In an RTL document, the identifier appears in three places with different rendering paths: the selected-subject detail, the native subject picker, and the live-region announcement. A bare Latin identifier embedded in Arabic text can be reordered with adjacent punctuation or label text.

- The detail identifier now has explicit `dir="ltr"` and CSS `unicode-bidi: isolate`, with left-aligned code text.
- The native picker option and Arabic live announcement wrap the identifier in Unicode FSI/PDI isolates. The option's actual value remains the unchanged stable ID, so selection and simulation state are unaffected.
- The existing 320×720 Arabic/RTL journey now asserts the computed direction/isolation, selected option text, and announcement text. No simulation rules, saved-record schema, scene art, or runtime dependencies changed.

### Current-head verification
- Implementation/test commit: `49ebe256fc1fb1e12525a853af582e943531de16`.
- Push CI [41363422946](https://github.com/ahpa5246-lgtm/WATCHED/actions/runs/41363422946) and PR CI [41363427343](https://github.com/ahpa5246-lgtm/WATCHED/actions/runs/41363427343) both completed successfully on the exact commit.
- `npm ci`: 0 vulnerabilities. JavaScript syntax checks passed. Node suite: 13 passed, 0 failed. Production build passed.
- Playwright: 16 passed, 2 intentional project skips. The 320×720 Arabic acceptance ran within the narrow project; desktop 1280×900 and narrow 760×900 journeys also passed.
- Browser artifact [13106356130](https://github.com/ahpa5246-lgtm/WATCHED/actions/runs/41363427343/artifacts/13106356130), 814,729 bytes, SHA-256 `81789cffa74ffcc39efa8c1083aff654f3f7e84877e0df2eccddb6cc162addb1`, is bound to the tested commit. I downloaded and inspected `320-rtl-operator-frame.png` (320×720) and `narrow-760-keyboard-subject-selection.png` (760px). The identifier remains legible as an LTR code in the selected-subject detail and picker; the 320px page retains its no-horizontal-overflow and reachable-control assertions.

### Product comparison and limits
- [Papers, Please](https://papersplea.se/) remains the direct reference for a focused inspection task and compact status hierarchy.
- [Beholder](https://store.steampowered.com/app/475550/Beholder) remains the direct surveillance-narrative reference for identifiable subjects and environmental context.
- [inkle](https://www.inklestudios.com/) remains the official narrative-hierarchy reference, not a surveillance-console competitor.
- This milestone improves directionality of operational identifiers only. It does not change the procedural scene art or information architecture. The feed still uses generic figures and geometric rooms; the original scene-art direction, manual NVDA/VoiceOver output, 200% zoom, mixed Arabic/Latin content beyond subject IDs, complete six-shift balance, and full visual-quality gate remain open. No visual-parity or WCAG-conformance claim is made.

The earlier mixed-direction-subject-ID item is superseded by this tested change. Keep PR #2 Draft; no merge or deployment.


## 2026-11-02 — migrate GitHub Actions to Node 24-compatible releases

### Failure-first evidence
- The current PR #2 head before this milestone was `241af5d85d96c204dc38ade845cd4637fdccc6e4`.
- CI run [41363581959](https://github.com/ahpa5246-lgtm/WATCHED/actions/runs/41363581959) passed the application checks, but its job log emitted a Node.js 20 deprecation warning for `actions/checkout@v4`, `actions/setup-node@v4`, and `actions/upload-artifact@v4`. This is a toolchain warning, not an application-test failure.
- The manual Pages workflow also retained older action majors: checkout v4, setup-node v4, configure-pages v5, upload-pages-artifact v3, and deploy-pages v4.

### Bounded maintenance change
- CI now uses `actions/checkout@v7`, `actions/setup-node@v7`, and `actions/upload-artifact@v7`.
- The manually triggered Pages workflow now uses `actions/configure-pages@v6`, `actions/upload-pages-artifact@v5`, and `actions/deploy-pages@v5`, alongside checkout/setup-node v7.
- Official action metadata was inspected at the release tags: checkout v7, setup-node v7, upload-artifact v7, configure-pages v6, and deploy-pages v5 declare `runs.using: node24`; upload-pages-artifact v5 is composite and invokes upload-artifact v7.0.0.
- The application runtime remains Node 20 in CI and the package engine remains `>=20`; this milestone changes JavaScript action runtimes only, not the app's supported Node range.
- The Pages workflow remains `workflow_dispatch` only. It was not run; no Pages build/deploy or publication was triggered.

### Product and visual review
- Downloaded and inspected the current-head browser artifact [13106356130](https://github.com/ahpa5246-lgtm/WATCHED/actions/runs/41363427343/artifacts/13106356130), including the 320×720 Arabic operator frame and 1280×900 desktop keyboard-selection capture.
- The existing direct-product comparison remains Papers, Please and Beholder, with inkle as an aspirational narrative reference. The screenshots still show generic stick figures and sparse room context; this CI-only milestone does not close that visual gap or pass the visual-quality gate.
- Manual NVDA/VoiceOver output, 200% zoom, broader mixed-direction copy, and six-shift balance remain unverified.

### Validation
- Pending the new PR CI run on the action-migration commit. Do not mark this milestone complete until the verify job passes and its log no longer reports Node 20 action-runtime deprecation for the migrated actions.
- The manual Pages workflow is intentionally not executed because it performs deployment, which is outside this authorization.

Keep PR #2 Draft. No merge or deployment.


### Current-head validation — 2026-11-02
- Implementation commit: `abaffee59943aeafa6e70c3ed039cac4caca840a`.
- Push CI [41365995067](https://github.com/ahpa5246-lgtm/WATCHED/actions/runs/41365995067) and PR CI [41366000783](https://github.com/ahpa5246-lgtm/WATCHED/actions/runs/41366000783) both completed successfully on the exact implementation commit.
- The PR verify job used checkout v7, setup-node v7 and upload-artifact v7; its log contains no Node.js 20 action-runtime deprecation warning for the migrated actions.
- `npm ci`: 0 vulnerabilities. JavaScript syntax checks passed. Node suite: 13 passed, 0 failed. Production build passed.
- Playwright: 16 passed, 2 intentional project skips across the desktop 1280×900 and narrow 760×900 projects; the 320×720 Arabic/RTL acceptance ran within the narrow project.
- Artifact [13106809316](https://github.com/ahpa5246-lgtm/WATCHED/actions/runs/41366000783/artifacts/13106809316), 815,596 bytes, SHA-256 `f6e24df3a0e1e2d0cf42f475d3618f278120473afb963d60778942c7fa873518`, is bound to the tested implementation commit. I downloaded it and inspected the 320×720 Arabic operator frame and desktop keyboard-selection capture. The narrow view keeps the subject controls reachable and has no horizontal overflow; the desktop scene still uses generic stick figures.
- Official release references inspected: [checkout v7](https://github.com/actions/checkout/releases/tag/v7.0.1), [setup-node v7](https://github.com/actions/setup-node/releases/tag/v7.1.0), [upload-artifact v7](https://github.com/actions/upload-artifact/releases/tag/v7.0.2), [configure-pages v6](https://github.com/actions/configure-pages/releases/tag/v6.0.0), [upload-pages-artifact v5](https://github.com/actions/upload-pages-artifact/releases/tag/v5.0.0), and [deploy-pages v5](https://github.com/actions/deploy-pages/releases/tag/v5.0.1). The first-party action metadata declares Node 24 for the JavaScript actions; upload-pages-artifact v5 is a composite wrapper around upload-artifact v7.
- The Pages workflow remains manual and was not dispatched. No deployment occurred.

### Final scope decision
This closes the CI action-runtime warning only. It does not alter the app's Node 20 minimum, gameplay, UI, or data. The visual-quality gate remains blocked by generic scene art and unverified manual screen-reader/200% zoom review. Keep PR #2 Draft; no merge or deployment.
