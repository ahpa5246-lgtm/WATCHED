export function createSafeStorage(storageProvider) {
  const resolveStorage = () => {
    try {
      return typeof storageProvider === "function" ? storageProvider() : null;
    } catch {
      return null;
    }
  };

  return Object.freeze({
    read(key) {
      const storage = resolveStorage();
      if (!storage) return { ok: false, value: null };
      try {
        return { ok: true, value: storage.getItem(key) };
      } catch {
        return { ok: false, value: null };
      }
    },

    write(key, value) {
      const storage = resolveStorage();
      if (!storage) return false;
      try {
        storage.setItem(key, value);
        return true;
      } catch {
        return false;
      }
    },

    remove(key) {
      const storage = resolveStorage();
      if (!storage) return false;
      try {
        storage.removeItem(key);
        return true;
      } catch {
        return false;
      }
    }
  });
}
