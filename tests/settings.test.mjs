import test from 'node:test';
import assert from 'node:assert/strict';
import { sanitizeSettings } from '../src/core/settings.js';

test('corrupt settings cannot break language, volume or motion controls', () => {
  for (const raw of [null, [], 'bad', {lang:'unknown',volume:NaN,scanlines:'false',reduceMotion:1}]) {
    assert.deepEqual(sanitizeSettings(raw), {lang:'en',volume:65,scanlines:true,reduceMotion:false});
  }
  assert.equal(sanitizeSettings({volume:300}).volume,100);
  assert.equal(sanitizeSettings({volume:-10}).volume,0);
  assert.deepEqual(sanitizeSettings({lang:'ar',volume:0,scanlines:false,reduceMotion:true}), {lang:'ar',volume:0,scanlines:false,reduceMotion:true});
});
