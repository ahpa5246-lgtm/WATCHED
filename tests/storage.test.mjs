import test from "node:test";
import assert from "node:assert/strict";
import { createSafeStorage } from "../src/core/storage.js";

test("distinguishes a missing key from unavailable browser storage", () => {
  const values = new Map();
  const storage = createSafeStorage(() => ({
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, String(value)),
    removeItem: (key) => values.delete(key)
  }));

  assert.deepEqual(storage.read("missing"), { ok: true, value: null });
  assert.equal(storage.write("draft", "saved"), true);
  assert.deepEqual(storage.read("draft"), { ok: true, value: "saved" });
  assert.equal(storage.remove("draft"), true);
  assert.deepEqual(storage.read("draft"), { ok: true, value: null });
});

test("contains a browser storage getter that throws", () => {
  const storage = createSafeStorage(() => {
    throw new DOMException("Storage access denied", "SecurityError");
  });

  assert.deepEqual(storage.read("save"), { ok: false, value: null });
  assert.equal(storage.write("save", "{}"), false);
  assert.equal(storage.remove("save"), false);
});

test("contains read, write and remove failures from an available storage object", () => {
  const storage = createSafeStorage(() => ({
    getItem() { throw new DOMException("Read denied", "SecurityError"); },
    setItem() { throw new DOMException("Write denied", "QuotaExceededError"); },
    removeItem() { throw new DOMException("Remove denied", "SecurityError"); }
  }));

  assert.deepEqual(storage.read("save"), { ok: false, value: null });
  assert.equal(storage.write("save", "{}"), false);
  assert.equal(storage.remove("save"), false);
});
