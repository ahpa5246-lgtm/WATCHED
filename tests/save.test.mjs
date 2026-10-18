import test from 'node:test';
import assert from 'node:assert/strict';
import { createInitialState } from '../src/core/sim.js';
import { decodeSaveRecord } from '../src/core/save.js';

test('a valid unfinished operator record can be resumed safely', () => {
  const state = createInitialState();
  state.started = true;
  state.shiftElapsed = 18.5;
  state.totalElapsed = 18.5;
  state.selectedSubject = state.subjects[0].id;
  state.focusing = true;
  state.paused = true;

  const restored = decodeSaveRecord(JSON.stringify(state));

  assert.ok(restored);
  assert.equal(restored.shiftElapsed, 18.5);
  assert.equal(restored.totalElapsed, 18.5);
  assert.equal(restored.paused, false);
  assert.equal(restored.focusing, false);
});

test('malformed, unsupported and completed records are not offered as resumable', () => {
  const finished = createInitialState();
  finished.finished = true;

  for (const serialized of [
    null,
    '',
    '{bad json',
    'null',
    '[]',
    JSON.stringify({ version: 999, subjects: [] }),
    JSON.stringify({ version: 1, subjects: 'not-an-array' }),
    JSON.stringify(finished),
  ]) {
    assert.equal(decodeSaveRecord(serialized), null);
  }
});

test('records with impossible progress values are rejected', () => {
  const state = createInitialState();

  for (const mutation of [
    { shift: 0 },
    { shift: 7 },
    { shiftElapsed: -1 },
    { totalElapsed: Number.NaN },
    { eventStates: [] },
    { selectedCamera: 'unknown' },
    { subjects: state.subjects.map((subject, index) => index === 0 ? { ...subject, stress: 'high' } : subject) },
    { zones: { ...state.zones, office: { ...state.zones.office, order: null } } },
  ]) {
    assert.equal(decodeSaveRecord(JSON.stringify({ ...state, ...mutation })), null);
  }
});
