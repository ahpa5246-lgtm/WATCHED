# WATCHED — Release Design Brief

## Product thesis

WATCHED is a 12–18 minute psychological systems game. The thesis is expressed mechanically: observation modifies the population being measured, which can cause the measurement system to confuse its own effects with evidence.

The player is not asked to choose between "surveillance good" and "surveillance bad." At least two genuine needs remain in tension throughout the run:

1. Observation can interrupt concrete harm.
2. Persistent observation changes ordinary behavior, trust, comfort, and the rate of false suspicion.

A run therefore produces an operator record, not a morality score.

## Core loop

1. Switch to a camera feed.
2. Notice behavior in a noisy, ambiguous environment.
3. Select a subject and inspect system risk.
4. Decide whether to focus, leave them alone, or flag them.
5. Watch the behavior and district metrics change.
6. Rotate coverage while incidents continue elsewhere.
7. Receive progressively more aggressive institutional targets.
8. Reach CAM 00 and discover the operator is another measured subject.

## Psychological design principles

### Reactivity rather than punishment

NPC stress is not a hidden "bad karma" meter. It changes visible behavior: pace, withdrawal, conformity, resistance, and the system's inferred risk. This makes the causal chain legible enough for players to form and revise hypotheses.

### Self-fulfilling suspicion

Focused observation raises awareness and stress. The risk classifier partially reads those same outputs. Long attention can therefore produce the cues that justify more attention. This is the game's primary psychological loop.

### Uncertainty must remain real

The game mixes harmless anomalies (laughter, pacing, private conversation, art) with actual high-severity incidents. If every unusual action is harmless, the game becomes a sermon. If every alert is dangerous, the surveillance system is trivially correct. The design requires both.

### Avoiding coercive child-targeted design

The game is not designed to manipulate children into compliance, disclose personal data, or reward real-world surveillance behavior. For younger players, the relevant learning outcome is media/system literacy: a measurement changes the environment being measured. The presentation contains no gore or sexual content, but the themes of authority, false accusation, and social pressure are better suited to older children/teens with context rather than very young children.

## Six-shift arc

### Shift 1 — Calibration

Teach camera switching, subject selection, focused observation, and coverage. Low-stakes events establish that "unusual" is not equivalent to harmful.

### Shift 2 — Visible Order

Expose the Order KPI. Include one genuine theft attempt so attention has legitimate value. The player can discover that long focus increases conformity and stress simultaneously.

### Shift 3 — Classification

Enable the meaning of the risk readout and encourage flags. Mix pacing, arguments, and ambiguous art. The player learns that risk is probabilistic.

### Shift 4 — Coverage

The institution starts treating unseen space as risk. This creates a resource-allocation problem: broad coverage reduces deep attention and vice versa.

### Shift 5 — Compliance

Management suggests near-perfect metrics but does not explicitly order a human-cost tradeoff. The player owns the optimization decision.

### Shift 6 — Audit

CAM 00 reveals the operator view and live behavior summary. There is no new target. This lets the player decide whether to keep optimizing or inspect the measurement system itself.

## Endings

Endings are calculated from behavior, not selected from a final menu.

- **Perfect Order:** high order, low public comfort.
- **Unwatched Space:** low order plus preventable missed harm.
- **Everything Became a Signal:** repeated false flags or excessive focus.
- **Limited Authority:** moderate/high order, preserved comfort, limited missed harm.
- **The Record Included You:** sustained self-observation with very low flagging.
- **Inconclusive Record:** mixed data that does not cleanly fit the other patterns.

None is labeled good/bad in the interface.

## Five release risks and mitigations

### 1. Repetition risk

**Problem:** camera switching and watching can become mechanically solved after five minutes.

**Mitigation:** each shift changes the decision problem rather than only increasing numbers: first learning, then KPI pressure, classification, coverage, compliance pressure, and self-audit. Scripted incidents combine with emergent NPC stress so the same action has new consequences later.

### 2. Preachiness risk

**Problem:** a game about surveillance can feel like a predetermined statement rather than a system worth exploring.

**Mitigation:** include genuine preventable harm; do not call moderate surveillance morally superior; do not reveal a morality meter; give no "good ending" label. Present outcome data and let the player interpret the tradeoff.

### 3. Opaque causality risk

**Problem:** if the simulation is too hidden, players may not understand that their behavior changed the city.

**Mitigation:** focused observation has visible selection geometry, attention rises in the subject panel, NPC state changes are readable, and the audit exposes aggregate consequences. Causality is discoverable without tutorial text explaining the thesis.

### 4. False-depth risk

**Problem:** if NPCs are only meters, players may perceive the theme but not care about the people.

**Mitigation:** persistent named subjects, distinct sensitivity/resistance profiles, recurring spaces, and repeated events create continuity. A future content pass can add micro-animations and environmental storytelling without changing the engine.

### 5. Commercial-scope risk

**Problem:** adding voice acting, cinematic cutscenes, large maps, or generative AI would raise cost without strengthening the core thesis.

**Mitigation:** keep the release deliberately short and authored. Procedural black/white visuals and synthesized sound eliminate asset licensing costs. Spend polish budget on responsiveness, typography, sound texture, event timing, QA, store art, and trailers.

## Release acceptance criteria

- A new player can finish without external instructions.
- All six shifts and all ending classes are reachable without console commands.
- No network request is required during play.
- A save can resume mid-run without breaking event state.
- Arabic and English remain usable at 320px CSS width.
- Reduced-motion mode removes nonessential blinking/transitions.
- No uncaught runtime exception appears during a full run.
- `npm test` and `npm run build` pass in CI.
- Store copy does not claim a medical/psychological effect or a formal age rating not issued by a ratings body.
