# WATCHED — Commercial Launch Checklist

This file separates the completed product work from storefront/account actions that cannot be safely inferred or automated.

## Completed in repository

- [x] Complete six-shift playable loop.
- [x] Five public cameras plus CAM 00 final self-audit.
- [x] Twelve persistent subjects with distinct observation responses.
- [x] Ambiguous events mixed with genuine preventable harm.
- [x] Observation -> awareness/stress/conformity/trust simulation.
- [x] Risk classifier that can be affected by observation-induced behavior.
- [x] Correct/false intervention tracking.
- [x] Six behavior-derived endings; no final morality-choice menu.
- [x] English and Arabic UI with RTL support.
- [x] Pointer and keyboard controls.
- [x] Local autosave/resume.
- [x] Volume, CRT scanline, and reduced-motion settings.
- [x] Procedural Canvas art and synthesized Web Audio; no third-party runtime art/audio licenses.
- [x] Responsive web layout.
- [x] Privacy notice: no analytics, account, ads, or telemetry.
- [x] Automated simulation tests.
- [x] JavaScript syntax validation in CI.
- [x] Reproducible zero-dependency static production build.
- [x] Main-branch CI packaging of `dist/` as a downloadable Actions artifact.
- [x] GitHub Pages deployment workflow prepared.
- [x] itch.io-ready HTML5 build structure.
- [x] Store-description draft and content note.
- [x] Design/risk document with explicit anti-preachiness and anti-repetition constraints.

## One-time account/storefront actions

- [ ] **Enable GitHub Pages:** Repository Settings -> Pages -> Build and deployment -> Source: GitHub Actions. Then manually run the "Deploy GitHub Pages" workflow.
- [ ] **Choose final storefront title:** `WATCHED` is a working title. Search current storefront and trademark databases before charging money; multiple unrelated indie games already use "Watched" on itch.io.
- [ ] **Human full-run QA:** complete at least one English and one Arabic run on the actual target browsers/devices. Automated simulation tests cannot validate subjective pacing, typography, or audio balance.
- [ ] **Playtest the thesis:** use several players who do not know the intended message. Check whether they independently discover that observation can both prevent harm and create suspicious behavior. If they describe the game as a lecture, retune events rather than adding explanatory text.
- [ ] **Store media:** capture clean screenshots, capsule/cover art, and a short trailer from the final build.
- [ ] **Store compliance:** complete the chosen storefront's current tax/payment, content-rating/content-disclosure, AI-content, privacy, and refund questionnaires using truthful project-specific answers.
- [ ] **Price and release strategy:** decide free/pay-what-you-want/paid only after external playtests confirm the 12–18 minute experience is strong enough for the intended price.

## Go / no-go criteria

Do not call a build commercially released merely because CI is green. Ship for money only when:

1. A complete run has no blocking bug on every supported browser/platform.
2. Arabic and English can both finish the game.
3. Save/resume survives refresh and does not duplicate or skip shifts.
4. All endings remain reachable and no single strategy trivially dominates.
5. At least a small blind playtest confirms the core causal relationship is understandable without author explanation.
6. The final title and store assets are cleared for the intended storefront.
7. The storefront listing accurately describes duration, controls, content, and privacy behavior.
