export function sanitizeSettings(raw = {}) {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) raw = {};
  return {
    lang: raw.lang === 'ar' ? 'ar' : 'en',
    volume: typeof raw.volume === 'number' && Number.isFinite(raw.volume) ? Math.max(0, Math.min(100, raw.volume)) : 65,
    scanlines: typeof raw.scanlines === 'boolean' ? raw.scanlines : true,
    reduceMotion: typeof raw.reduceMotion === 'boolean' ? raw.reduceMotion : false,
  };
}
