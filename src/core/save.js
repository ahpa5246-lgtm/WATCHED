import { createInitialState, sanitizeLoadedState } from './sim.js';

const isRecord = (value) => Boolean(value) && typeof value === 'object' && !Array.isArray(value);
const isFiniteNonNegative = (value) => Number.isFinite(value) && value >= 0;
const template = createInitialState();
const zoneIds = Object.keys(template.zones);
const subjectIds = new Set(template.subjects.map((subject) => subject.id));
const subjectNumericKeys = Object.keys(template.subjects[0]).filter((key) => typeof template.subjects[0][key] === 'number');
const zoneNumericKeys = Object.keys(template.zones.office).filter((key) => typeof template.zones.office[key] === 'number');
const statsNumericKeys = Object.keys(template.stats).filter((key) => typeof template.stats[key] === 'number');

const hasFiniteNumbers = (record, keys) => keys.every((key) => Number.isFinite(record[key]));

function hasValidProgressShape(raw) {
  if (!isRecord(raw) || raw.version !== 1 || raw.finished !== false) return false;
  if (!Number.isInteger(raw.shift) || raw.shift < 1 || raw.shift > 6) return false;
  if (!isFiniteNonNegative(raw.shiftElapsed) || !isFiniteNonNegative(raw.totalElapsed) || raw.shiftElapsed > raw.totalElapsed) return false;
  if (!zoneIds.includes(raw.selectedCamera)) return false;
  if (![raw.started, raw.paused, raw.focusing].every((value) => typeof value === 'boolean')) return false;
  if (!Array.isArray(raw.subjects) || !isRecord(raw.zones) || !isRecord(raw.stats) || !isRecord(raw.eventStates)) return false;
  if (raw.subjects.length !== subjectIds.size) return false;
  if (raw.subjects.some((subject) => !isRecord(subject) || !subjectIds.has(subject.id) || !zoneIds.includes(subject.zone) || !hasFiniteNumbers(subject, subjectNumericKeys))) return false;
  if (new Set(raw.subjects.map((subject) => subject.id)).size !== subjectIds.size) return false;
  if (zoneIds.some((zoneId) => !isRecord(raw.zones[zoneId]) || !hasFiniteNumbers(raw.zones[zoneId], zoneNumericKeys))) return false;
  if (!hasFiniteNumbers(raw.stats, statsNumericKeys)) return false;
  if (!isRecord(raw.stats.cameraSeconds) || !Array.isArray(raw.stats.inspected)) return false;
  if (zoneIds.some((zoneId) => !isFiniteNonNegative(raw.stats.cameraSeconds[zoneId]))) return false;
  if (Object.values(raw.eventStates).some((event) => !isRecord(event))) return false;
  return true;
}

export function decodeSaveRecord(serialized) {
  if (typeof serialized !== 'string' || serialized.length === 0) return null;
  try {
    const raw = JSON.parse(serialized);
    if (!hasValidProgressShape(raw)) return null;
    return sanitizeLoadedState(raw);
  } catch {
    return null;
  }
}
