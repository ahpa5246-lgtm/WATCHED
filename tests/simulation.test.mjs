import test from 'node:test';
import assert from 'node:assert/strict';
import {
  createInitialState,
  tickState,
  selectSubject,
  toggleFocus,
  flagSelected,
  computeGlobalMetrics,
  classifyEnding,
  sanitizeLoadedState,
} from '../src/core/sim.js';

test('initial simulation state is playable and bounded', () => {
  const s = createInitialState();
  assert.equal(s.shift, 1);
  assert.equal(s.subjects.length, 12);
  const m = computeGlobalMetrics(s);
  assert.ok(m.order >= 0 && m.order <= 100);
  assert.ok(m.coverage >= 0 && m.coverage <= 100);
});

test('focused observation increases awareness and stress', () => {
  const s = createInitialState();
  s.started = true;
  const subject = s.subjects.find((x) => x.zone === 'office');
  selectSubject(s, subject.id);
  toggleFocus(s);
  const before = { awareness: subject.awareness, stress: subject.stress };
  for (let i = 0; i < 200; i++) tickState(s, .05);
  assert.ok(subject.awareness > before.awareness);
  assert.ok(subject.stress > before.stress);
  assert.ok(s.stats.focusSeconds > 0);
});

test('false flag creates more stress and records false positive', () => {
  const s = createInitialState();
  s.started = true;
  const subject = s.subjects.find((x) => x.zone === 'office');
  selectSubject(s, subject.id);
  const before = subject.stress;
  const result = flagSelected(s);
  assert.equal(result.ok, true);
  assert.equal(result.justified, false);
  assert.equal(s.stats.falseFlags, 1);
  assert.ok(subject.stress > before);
});

test('loaded saves are migrated against fresh defaults', () => {
  const s = createInitialState();
  const loaded = sanitizeLoadedState({ version: 1, shift: 3, subjects: s.subjects.slice(0, 2), stats: { flags: 7 } });
  assert.equal(loaded.shift, 3);
  assert.equal(loaded.subjects.length, 12);
  assert.equal(loaded.stats.flags, 7);
  assert.equal(loaded.paused, false);
});

test('ending classifier can detect measured outcome', () => {
  const s = createInitialState();
  for (const zone of Object.values(s.zones)) {
    zone.order = 70;
    zone.life = 70;
    zone.seen = 30;
    zone.lastSeen = 0;
  }
  s.totalElapsed = 1;
  for (const key of ['office','cafe','square','alley','transit']) s.zones[key].lastSeen = 1;
  assert.equal(classifyEnding(s), 'measured');
});
