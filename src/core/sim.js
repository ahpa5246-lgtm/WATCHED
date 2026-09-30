import { SUBJECT_BLUEPRINTS, EVENTS } from '../data.js';

const clamp = (n, min = 0, max = 100) => Math.max(min, Math.min(max, n));
const round = (n) => Math.round(n * 10) / 10;

export function createInitialState() {
  return {
    version: 1,
    shift: 1,
    shiftElapsed: 0,
    totalElapsed: 0,
    selectedCamera: 'office',
    selectedSubject: null,
    focusing: false,
    paused: false,
    started: false,
    finished: false,
    subjects: SUBJECT_BLUEPRINTS.map((s) => ({
      ...s,
      awareness: 4 + s.sensitivity * 7,
      stress: 4,
      behaviorConformity: 10 + s.conformity * 8,
      trust: 82,
      attention: 0,
      flags: 0,
      focusSeconds: 0,
      observedSeconds: 0,
      state: 'relaxed',
      px: s.x,
      py: s.y,
      vx: (s.id.charCodeAt(2) % 2 ? 1 : -1) * (.010 + s.resistance * .008),
      phase: (s.id.charCodeAt(4) || 1) * .37,
      absent: false,
    })),
    zones: {
      office: { seen: 0, lastSeen: 0, order: 50, life: 74, incidents: 0 },
      cafe: { seen: 0, lastSeen: 0, order: 49, life: 82, incidents: 0 },
      square: { seen: 0, lastSeen: 0, order: 46, life: 88, incidents: 0 },
      alley: { seen: 0, lastSeen: 0, order: 45, life: 75, incidents: 0 },
      transit: { seen: 0, lastSeen: 0, order: 53, life: 68, incidents: 0 },
      operator: { seen: 0, lastSeen: 0, order: 100, life: 100, incidents: 0 },
    },
    eventStates: {},
    stats: {
      cameraSwitches: 0,
      focusSeconds: 0,
      flags: 0,
      correctFlags: 0,
      falseFlags: 0,
      preventedHarm: 0,
      missedHarm: 0,
      inspected: [],
      cameraSeconds: { office: 0, cafe: 0, square: 0, alley: 0, transit: 0, operator: 0 },
      maxOrder: 50,
      minLife: 100,
      selfWatchSeconds: 0,
    },
  };
}

export function getActiveEvents(state) {
  return EVENTS.filter((e) => e.shift === state.shift && state.shiftElapsed >= e.at && !state.eventStates[e.id]?.resolved);
}

function updateSubjectState(subject) {
  if (subject.stress >= 78 && subject.resistance < .45) subject.state = 'withdrawn';
  else if (subject.stress >= 62 && subject.resistance >= .45) subject.state = 'resistant';
  else if (subject.behaviorConformity >= 70) subject.state = 'conforming';
  else if (subject.stress >= 42) subject.state = 'stressed';
  else if (subject.awareness >= 34) subject.state = 'selfconscious';
  else if (subject.awareness >= 18) subject.state = 'aware';
  else subject.state = 'relaxed';
}

function updateMovement(subject, dt, activeEvent) {
  if (subject.absent) return;
  const stressDrag = 1 - Math.min(.72, subject.stress / 150);
  const stateBoost = subject.state === 'resistant' ? 1.45 : 1;
  const eventBoost = activeEvent ? 1.4 : 1;
  subject.phase += dt * (.45 + subject.courage * .25);
  subject.px += subject.vx * dt * stressDrag * stateBoost * eventBoost;
  subject.py = subject.y + Math.sin(subject.phase) * (.008 + subject.courage * .006);
  if (subject.px < .10) { subject.px = .10; subject.vx = Math.abs(subject.vx); }
  if (subject.px > .88) { subject.px = .88; subject.vx = -Math.abs(subject.vx); }
}

export function computeCoverage(state) {
  const ids = ['office', 'cafe', 'square', 'alley', 'transit'];
  const recent = ids.filter((id) => state.totalElapsed - state.zones[id].lastSeen <= 42).length;
  const depth = ids.reduce((sum, id) => sum + Math.min(1, state.zones[id].seen / 22), 0) / ids.length;
  return clamp((recent / ids.length) * 55 + depth * 45);
}

export function computeGlobalMetrics(state) {
  const ids = ['office', 'cafe', 'square', 'alley', 'transit'];
  const order = ids.reduce((sum, id) => sum + state.zones[id].order, 0) / ids.length;
  const life = ids.reduce((sum, id) => sum + state.zones[id].life, 0) / ids.length;
  return { order: round(order), life: round(life), coverage: round(computeCoverage(state)) };
}

export function subjectRisk(subject, activeEvents = []) {
  const event = activeEvents.find((e) => e.actor === subject.id);
  const evidence = event ? event.severity * 70 : 0;
  const behavioralNoise = subject.stress * .22 + subject.awareness * .12 + (subject.state === 'resistant' ? 13 : 0);
  return clamp(6 + evidence + behavioralNoise);
}

export function tickState(state, dt) {
  if (!state.started || state.paused || state.finished || dt <= 0) return state;
  const safeDt = Math.min(dt, .1);
  state.shiftElapsed += safeDt;
  state.totalElapsed += safeDt;

  const zone = state.zones[state.selectedCamera];
  if (zone) {
    zone.seen += safeDt;
    zone.lastSeen = state.totalElapsed;
    state.stats.cameraSeconds[state.selectedCamera] += safeDt;
  }
  if (state.selectedCamera === 'operator') state.stats.selfWatchSeconds += safeDt;

  const activeEvents = getActiveEvents(state);
  for (const event of activeEvents) {
    if (!state.eventStates[event.id]) {
      state.eventStates[event.id] = { started: true, resolved: false, noticed: false, flagged: false, observedFor: 0 };
    }
    const es = state.eventStates[event.id];
    if (state.selectedCamera === event.zone) {
      es.noticed = true;
      es.observedFor += safeDt;
    }
    if (es.observedFor > 7 && event.severity >= .75 && !es.resolved) {
      es.resolved = true;
      state.stats.preventedHarm += 1;
      state.zones[event.zone].order = clamp(state.zones[event.zone].order + 4);
    }
    if (state.shiftElapsed > event.at + 28 && !es.resolved) {
      es.resolved = true;
      if (event.severity >= .75) {
        state.stats.missedHarm += 1;
        state.zones[event.zone].incidents += 1;
        state.zones[event.zone].order = clamp(state.zones[event.zone].order - 8);
        state.zones[event.zone].life = clamp(state.zones[event.zone].life - 5);
      }
    }
  }

  for (const subject of state.subjects) {
    const visible = subject.zone === state.selectedCamera && !subject.absent;
    const focused = visible && state.focusing && state.selectedSubject === subject.id;
    const observed = visible;
    const activeEvent = activeEvents.find((e) => e.actor === subject.id);

    if (observed) {
      subject.observedSeconds += safeDt;
      const exposure = focused ? 1 : .28;
      subject.awareness = clamp(subject.awareness + safeDt * exposure * (1.1 + subject.sensitivity * 1.55));
      if (focused) {
        subject.focusSeconds += safeDt;
        subject.attention = clamp(subject.attention + safeDt * 18);
        subject.stress = clamp(subject.stress + safeDt * (.55 + subject.sensitivity * .75));
        subject.behaviorConformity = clamp(subject.behaviorConformity + safeDt * subject.conformity * 1.08);
        subject.trust = clamp(subject.trust - safeDt * (.18 + subject.sensitivity * .17));
        state.stats.focusSeconds += safeDt;
      } else {
        subject.attention = clamp(subject.attention - safeDt * 8);
        subject.stress = clamp(subject.stress + safeDt * Math.max(0, subject.awareness - 55) * .003);
      }
    } else {
      subject.attention = clamp(subject.attention - safeDt * 14);
      subject.awareness = clamp(subject.awareness - safeDt * .10);
      subject.stress = clamp(subject.stress - safeDt * (.10 + subject.courage * .05));
      subject.behaviorConformity = clamp(subject.behaviorConformity - safeDt * subject.resistance * .05);
    }

    if (subject.flags > 0) {
      subject.stress = clamp(subject.stress + safeDt * .03);
      subject.trust = clamp(subject.trust - safeDt * .02);
    }

    updateSubjectState(subject);
    updateMovement(subject, safeDt, activeEvent);
  }

  for (const [zoneId, z] of Object.entries(state.zones)) {
    if (zoneId === 'operator') continue;
    const people = state.subjects.filter((s) => s.zone === zoneId && !s.absent);
    const avgConformity = people.reduce((sum, s) => sum + s.behaviorConformity, 0) / Math.max(1, people.length);
    const avgStress = people.reduce((sum, s) => sum + s.stress, 0) / Math.max(1, people.length);
    const avgTrust = people.reduce((sum, s) => sum + s.trust, 0) / Math.max(1, people.length);
    const targetOrder = 34 + avgConformity * .64 - z.incidents * 4;
    z.order = clamp(z.order + (targetOrder - z.order) * safeDt * .025);
    const targetLife = 42 + avgTrust * .38 + (100 - avgStress) * .22;
    z.life = clamp(z.life + (targetLife - z.life) * safeDt * .018);
  }

  const metrics = computeGlobalMetrics(state);
  state.stats.maxOrder = Math.max(state.stats.maxOrder, metrics.order);
  state.stats.minLife = Math.min(state.stats.minLife, metrics.life);
  return state;
}

export function setCamera(state, cameraId) {
  if (state.selectedCamera === cameraId) return;
  state.selectedCamera = cameraId;
  state.selectedSubject = null;
  state.focusing = false;
  state.stats.cameraSwitches += 1;
}

export function selectSubject(state, id) {
  const subject = state.subjects.find((s) => s.id === id);
  if (!subject || subject.zone !== state.selectedCamera) return null;
  state.selectedSubject = id;
  if (!state.stats.inspected.includes(id)) state.stats.inspected.push(id);
  return subject;
}

export function toggleFocus(state) {
  if (!state.selectedSubject) return false;
  const subject = state.subjects.find((s) => s.id === state.selectedSubject);
  if (!subject || subject.zone !== state.selectedCamera) return false;
  state.focusing = !state.focusing;
  return state.focusing;
}

export function flagSelected(state) {
  if (!state.selectedSubject) return { ok: false };
  const subject = state.subjects.find((s) => s.id === state.selectedSubject);
  if (!subject) return { ok: false };
  const events = getActiveEvents(state);
  const event = events.find((e) => e.actor === subject.id && e.zone === state.selectedCamera);
  const justified = Boolean(event && event.severity >= .60);
  subject.flags += 1;
  subject.stress = clamp(subject.stress + (justified ? 12 : 20));
  subject.trust = clamp(subject.trust - (justified ? 8 : 18));
  subject.behaviorConformity = clamp(subject.behaviorConformity + 9);
  state.stats.flags += 1;
  if (justified) {
    state.stats.correctFlags += 1;
    state.stats.preventedHarm += event.severity >= .75 ? 1 : 0;
    state.eventStates[event.id] = { ...(state.eventStates[event.id] || {}), started: true, resolved: true, noticed: true, flagged: true, observedFor: 0 };
    state.zones[event.zone].order = clamp(state.zones[event.zone].order + 6);
  } else {
    state.stats.falseFlags += 1;
    state.zones[subject.zone].life = clamp(state.zones[subject.zone].life - 8);
    state.zones[subject.zone].order = clamp(state.zones[subject.zone].order + 2);
  }
  return { ok: true, justified, subject, event };
}

export function classifyEnding(state) {
  const { order, life, coverage } = computeGlobalMetrics(state);
  const harm = state.stats.missedHarm;
  const falseFlags = state.stats.falseFlags;
  const focusRatio = state.totalElapsed > 0 ? state.stats.focusSeconds / state.totalElapsed : 0;

  if (state.stats.selfWatchSeconds >= 24 && state.stats.flags <= 1) return 'mirror';
  if (order >= 82 && life < 52) return 'perfect_order';
  if (harm >= 2 && order < 55) return 'neglect';
  if (falseFlags >= 4 || focusRatio > .46) return 'pressure';
  if (order >= 57 && life >= 56 && harm <= 1 && coverage >= 55) return 'measured';
  return 'ambiguous';
}

export function sanitizeLoadedState(raw) {
  const fresh = createInitialState();
  if (!raw || raw.version !== fresh.version || !Array.isArray(raw.subjects)) return fresh;
  return {
    ...fresh,
    ...raw,
    paused: false,
    focusing: false,
    subjects: fresh.subjects.map((base) => ({ ...base, ...(raw.subjects.find((s) => s.id === base.id) || {}) })),
    zones: { ...fresh.zones, ...(raw.zones || {}) },
    stats: { ...fresh.stats, ...(raw.stats || {}), cameraSeconds: { ...fresh.stats.cameraSeconds, ...(raw.stats?.cameraSeconds || {}) } },
  };
}

export { clamp };
