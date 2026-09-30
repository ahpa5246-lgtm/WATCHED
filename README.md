# WATCHED

A short, monochrome psychological surveillance game about attention, compliance, uncertainty, and what observation changes.

**Status:** playable commercial-release candidate. The game is deliberately asset-light: all visuals are rendered procedurally in Canvas and all sound is synthesized with Web Audio, so the repository has no third-party art/audio license dependency.

## Premise

You are an operator in a six-shift civic observation pilot. The console rewards visible order and broad camera coverage. Watching people, however, changes how they behave. The game tracks both the city and the operator: who you watch, how long you focus, what you flag, what you ignore, and whether the system's suspicion becomes self-reinforcing.

The game never declares a single moral answer. Some observation prevents real harm; excessive observation increases stress, conformity, withdrawal, and false positives. The final audit interprets the player's actual record rather than a dialogue choice.

## Play

- Click a camera to change feeds. Keyboard: `1–5`; `0` unlocks in the final shift.
- Click a visible person to inspect them.
- `E` toggles focused observation.
- `F` flags the selected subject for intervention.
- `Esc` pauses.
- Progress auto-saves locally every few seconds. No account or telemetry is used.

A full run is designed for roughly 12–18 minutes depending on reading and play style.

## Development

Requirements: Node.js 20+. No third-party runtime or build dependencies are required.

```bash
npm run dev
```

Production verification:

```bash
npm test
npm run build
```

The built game is emitted to `dist/` and is a static site suitable for GitHub Pages, itch.io HTML5 hosting, Netlify, Cloudflare Pages, or any ordinary web server.

### GitHub Pages preview

Before the first Pages deployment, open **Settings → Pages → Build and deployment** and select **GitHub Actions** as the source. Then run the **Deploy GitHub Pages** workflow from the Actions tab. This repository keeps Pages deployment manual until that one-time repository setting is enabled.

## Commercial packaging

For itch.io, run `npm run build` and upload the contents of `dist/` as an HTML5 game. Keep `index.html` at the archive root.

For desktop storefronts, the static build can later be wrapped with Tauri/Electron without changing the simulation layer. The current repository intentionally avoids that dependency so the browser build remains the canonical, low-risk release.

## Accessibility and content

- English and Arabic UI; Arabic uses RTL layout.
- Adjustable volume.
- Optional CRT scanlines.
- Reduced-motion mode.
- Keyboard and pointer controls.
- Automatic pause on tab loss.
- No gore. Themes include surveillance, social pressure, false accusation, and implied petty crime.

## Privacy

WATCHED stores settings and save progress in browser `localStorage`. It performs no network requests during play and includes no analytics SDK.

## Intellectual property

No open-source license is granted by this repository. Unless the copyright holder states otherwise, the source code, game text, title treatment, and original game assets are all rights reserved. Review storefront naming/trademark availability before a paid launch.
