import { sanitizeSettings } from './core/settings.js';
import { createSafeStorage } from './core/storage.js';
import { ZONES, SHIFTS, EVENT_TEXT, TRANSLATIONS } from './data.js';
import {
  createInitialState,
  tickState,
  setCamera,
  selectSubject,
  toggleFocus,
  flagSelected,
  computeGlobalMetrics,
  subjectRisk,
  getActiveEvents,
  classifyEnding,
} from './core/sim.js';
import { AudioEngine } from './audio.js';
import { decodeSaveRecord } from './core/save.js';

const SAVE_KEY = 'watched.save.v1';
const SETTINGS_KEY = 'watched.settings.v1';
const $ = (id) => document.getElementById(id);
const app = $('app');
const canvas = $('gameCanvas');
const ctx = canvas.getContext('2d');
const audio = new AudioEngine();
const storage = createSafeStorage(() => window.localStorage);

const el = {
  menu: $('menuOverlay'), briefing: $('briefingOverlay'), pause: $('pauseOverlay'), settings: $('settingsOverlay'), ending: $('endingOverlay'),
  newGame: $('newGameBtn'), continueGame: $('continueBtn'), menuSettings: $('menuSettingsBtn'), settingsBtn: $('settingsBtn'), pauseBtn: $('pauseBtn'),
  startShift: $('startShiftBtn'), resume: $('resumeBtn'), pauseSettings: $('pauseSettingsBtn'), quit: $('quitBtn'), closeSettings: $('closeSettingsBtn'), resetProgress: $('resetProgressBtn'), restart: $('restartBtn'),
  language: $('languageSelect'), volume: $('volumeRange'), scanlines: $('scanlinesToggle'), motion: $('motionToggle'),
  cameraButtons: $('cameraButtons'), subjectSelect: $('subjectSelect'), subjectEmpty: $('subjectEmpty'), subjectInfo: $('subjectInfo'), subjectName: $('subjectName'), subjectId: $('subjectId'),
  subjectState: $('subjectState'), subjectAttention: $('subjectAttention'), subjectRisk: $('subjectRisk'), focusBtn: $('focusBtn'), flagBtn: $('flagBtn'),
  log: $('logEntries'), orderMeter: $('orderMeter'), coverageMeter: $('coverageMeter'), orderValue: $('orderValue'), coverageValue: $('coverageValue'),
  objective: $('objectiveText'), camLabel: $('camLabel'), clockLabel: $('clockLabel'), shiftLabel: $('shiftLabel'), saveLabel: $('saveLabel'), signalLoss: $('signalLoss'),
  briefingKicker: $('briefingKicker'), briefingTitle: $('briefingTitle'), briefingBody: $('briefingBody'), briefingTargets: $('briefingTargets'),
  endingTitle: $('endingTitle'), endingBody: $('endingBody'), auditGrid: $('auditGrid'),
};

let settings = loadSettings();
let state = createInitialState();
let lastFrame = performance.now();
let lastSaveAt = 0;
let logItems = [];
let announcedEvents = new Set();
let preSettingsOverlay = 'menu';
let pausedBeforeSettings = false;
let signalTimer = 0;
let shiftTransitioning = false;
let cameraSignature = '';
let subjectPickerSignature = '';
let subjectPickerSelection = null;
let activeOverlay = null;
let settingsReturnFocus = null;

function loadSettings() {
  const defaults = { lang: 'en', volume: 65, scanlines: true, reduceMotion: false };
  const saved = storage.read(SETTINGS_KEY);
  if (!saved.ok) return defaults;
  try { return sanitizeSettings(JSON.parse(saved.value || '{}')); }
  catch { return defaults; }
}

function persistSettings() {
  if (!storage.write(SETTINGS_KEY, JSON.stringify(settings))) {
    el.saveLabel.textContent = settings.lang === 'ar' ? 'تعذر حفظ الإعدادات' : 'SETTINGS SAVE FAILED';
  }
}

function hasSave() {
  const saved = storage.read(SAVE_KEY);
  if (!saved.ok) {
    el.saveLabel.textContent = settings.lang === 'ar' ? 'التخزين المحلي غير متاح' : 'LOCAL STORAGE UNAVAILABLE';
    return false;
  }
  return Boolean(decodeSaveRecord(saved.value));
}

function saveGame() {
  if (!state.started && state.shiftElapsed === 0) return;
  if (!storage.write(SAVE_KEY, JSON.stringify(state))) {
    el.saveLabel.textContent = settings.lang === 'ar' ? 'فشل الحفظ المحلي' : 'LOCAL SAVE FAILED';
    return;
  }
  el.saveLabel.textContent = settings.lang === 'ar' ? 'السجل المحلي // محفوظ' : 'LOCAL RECORD // SAVED';
  setTimeout(() => { el.saveLabel.textContent = settings.lang === 'ar' ? 'السجل المحلي // جاهز' : 'LOCAL RECORD // READY'; }, 1200);
}

function loadGame() {
  const saved = storage.read(SAVE_KEY);
  if (!saved.ok) return false;
  const restored = decodeSaveRecord(saved.value);
  if (!restored) return false;
  state = restored;
  rebuildAnnouncementState();
  return true;
}

function rebuildAnnouncementState() {
  announcedEvents = new Set(Object.entries(state.eventStates || {}).filter(([, v]) => v?.started).map(([id]) => id));
}

function t(key) { return TRANSLATIONS[settings.lang]?.[key] ?? TRANSLATIONS.en[key] ?? key; }
function loc(value) { return typeof value === 'string' ? value : value?.[settings.lang] ?? value?.en ?? ''; }

function applySettings() {
  document.documentElement.lang = settings.lang;
  document.documentElement.dir = settings.lang === 'ar' ? 'rtl' : 'ltr';
  document.body.classList.toggle('scanlines', settings.scanlines);
  document.body.classList.toggle('reduce-motion', settings.reduceMotion);
  el.language.value = settings.lang;
  el.volume.value = settings.volume;
  el.scanlines.checked = settings.scanlines;
  el.motion.checked = settings.reduceMotion;
  audio.setVolume(settings.volume / 100);
  document.querySelectorAll('[data-i18n]').forEach((node) => {
    const key = node.dataset.i18n;
    if (t(key)) node.textContent = t(key);
  });
  cameraSignature = '';
  refreshStaticUI();
}

function refreshStaticUI() {
  renderCameraButtons();
  updateSubjectPanel();
  const shift = SHIFTS[state.shift - 1];
  if (shift) el.objective.textContent = loc(shift.objective);
  el.shiftLabel.textContent = settings.lang === 'ar' ? `الوردية ${String(state.shift).padStart(2,'0')} / 06` : `SHIFT ${String(state.shift).padStart(2,'0')} / 06`;
}

const FOCUSABLE_SELECTOR = 'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';

function focusableWithin(container) {
  return [...container.querySelectorAll(FOCUSABLE_SELECTOR)].filter((node) =>
    !node.closest('.hidden') && node.getAttribute('aria-hidden') !== 'true' && node.getClientRects().length > 0
  );
}

function showOnly(name, focusTarget = null) {
  const map = { menu: el.menu, briefing: el.briefing, pause: el.pause, settings: el.settings, ending: el.ending };
  Object.values(map).forEach((node) => node.classList.add('hidden'));
  const overlay = name && map[name] ? map[name] : null;
  activeOverlay = overlay ? name : null;
  app.inert = Boolean(overlay);

  if (overlay) {
    app.setAttribute('aria-hidden', 'true');
    overlay.classList.remove('hidden');
    const dialog = overlay.querySelector('[role="dialog"]');
    const target = focusTarget && overlay.contains(focusTarget)
      ? focusTarget
      : focusableWithin(overlay)[0] || dialog;
    target?.focus({ preventScroll: true });
    return;
  }

  app.removeAttribute('aria-hidden');
  const target = focusTarget && !focusTarget.disabled && focusTarget.getClientRects().length > 0
    ? focusTarget
    : focusableWithin(app)[0];
  target?.focus({ preventScroll: true });
}

function trapOverlayTab(event) {
  if (!activeOverlay || event.key !== 'Tab') return;
  const map = { menu: el.menu, briefing: el.briefing, pause: el.pause, settings: el.settings, ending: el.ending };
  const overlay = map[activeOverlay];
  if (!overlay) return;
  const focusable = focusableWithin(overlay);
  if (!focusable.length) {
    event.preventDefault();
    overlay.querySelector('[role="dialog"]')?.focus({ preventScroll: true });
    return;
  }
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (!overlay.contains(document.activeElement)) {
    event.preventDefault();
    (event.shiftKey ? last : first).focus({ preventScroll: true });
  } else if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus({ preventScroll: true });
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus({ preventScroll: true });
  }
}

document.addEventListener('keydown', trapOverlayTab, true);

function openSettings(from = 'game') {
  preSettingsOverlay = from;
  pausedBeforeSettings = state.paused;
  settingsReturnFocus = from === 'pause' ? el.pauseSettings : from === 'menu' ? el.menuSettings : el.settingsBtn;
  if (from === 'game') state.paused = true;
  showOnly('settings');
}

function closeSettings() {
  const destination = preSettingsOverlay === 'game' ? null : preSettingsOverlay;
  showOnly(destination, settingsReturnFocus);
  settingsReturnFocus = null;
}

function startNewGame() {
  audio.resume();
  state = createInitialState();
  logItems = [];
  announcedEvents.clear();
  cameraSignature = '';
  if (!storage.remove(SAVE_KEY)) {
    el.saveLabel.textContent = settings.lang === 'ar' ? 'تعذر مسح السجل المحلي' : 'LOCAL SAVE CLEAR FAILED';
  }
  showBriefing();
}

function continueGame() {
  audio.resume();
  if (!loadGame()) return startNewGame();
  state.started = true;
  state.paused = false;
  cameraSignature = '';
  showOnly(null, el.pauseBtn);
  addLog(settings.lang === 'ar' ? 'تمت استعادة سجل المُشغِّل.' : 'Operator record restored.');
}

function showBriefing() {
  const shift = SHIFTS[state.shift - 1];
  if (!shift) return endGame();
  state.started = false;
  state.paused = false;
  el.briefingKicker.textContent = settings.lang === 'ar' ? `الوردية ${String(shift.id).padStart(2,'0')} / 06` : `SHIFT ${String(shift.id).padStart(2,'0')} / 06`;
  el.briefingTitle.textContent = loc(shift.title);
  el.briefingBody.textContent = loc(shift.body);
  el.briefingTargets.innerHTML = loc(shift.targets).map((line) => `<div class="briefing-target">${escapeHtml(line)}</div>`).join('');
  el.objective.textContent = loc(shift.objective);
  showOnly('briefing', el.startShift);
}

function beginShift() {
  audio.resume(); audio.click();
  state.started = true;
  state.paused = false;
  state.shiftElapsed = Math.max(0, state.shiftElapsed || 0);
  showOnly(null, el.pauseBtn);
  addLog(settings.lang === 'ar' ? `بدأت الوردية ${String(state.shift).padStart(2,'0')}.` : `Shift ${String(state.shift).padStart(2,'0')} started.`);
  saveGame();
}

function completeShift() {
  if (shiftTransitioning) return;
  shiftTransitioning = true;
  state.started = false;
  state.focusing = false;
  saveGame();
  const oldShift = state.shift;
  if (oldShift >= SHIFTS.length) {
    setTimeout(() => { shiftTransitioning = false; endGame(); }, settings.reduceMotion ? 0 : 650);
    return;
  }
  state.shift += 1;
  state.shiftElapsed = 0;
  state.selectedSubject = null;
  cameraSignature = '';
  if (state.shift === 6) addLog(settings.lang === 'ar' ? 'تم فتح CAM 00.' : 'CAM 00 unlocked.', 'alert');
  setTimeout(() => { shiftTransitioning = false; showBriefing(); refreshStaticUI(); }, settings.reduceMotion ? 0 : 500);
}

function endGame() {
  state.finished = true;
  state.started = false;
  state.paused = false;
  state.focusing = false;
  saveGame();
  if (!storage.remove(SAVE_KEY)) {
    el.saveLabel.textContent = settings.lang === 'ar' ? 'تعذر مسح السجل المحلي' : 'LOCAL SAVE CLEAR FAILED';
  }
  const ending = classifyEnding(state);
  const metrics = computeGlobalMetrics(state);
  const copy = endingCopy(ending);
  el.endingTitle.textContent = copy.title;
  el.endingBody.textContent = copy.body;
  const focusedPct = state.totalElapsed ? Math.round(state.stats.focusSeconds / state.totalElapsed * 100) : 0;
  const audit = [
    [settings.lang === 'ar' ? 'النظام النهائي' : 'FINAL ORDER', `${Math.round(metrics.order)}%`],
    [settings.lang === 'ar' ? 'راحة المجتمع' : 'PUBLIC COMFORT', `${Math.round(metrics.life)}%`],
    [settings.lang === 'ar' ? 'وقت التركيز' : 'FOCUS TIME', `${focusedPct}%`],
    [settings.lang === 'ar' ? 'الإبلاغات' : 'FLAGS', String(state.stats.flags)],
    [settings.lang === 'ar' ? 'إنذارات خاطئة' : 'FALSE FLAGS', String(state.stats.falseFlags)],
    [settings.lang === 'ar' ? 'ضرر مُنع' : 'HARM PREVENTED', String(state.stats.preventedHarm)],
    [settings.lang === 'ar' ? 'ضرر فائت' : 'HARM MISSED', String(state.stats.missedHarm)],
    [settings.lang === 'ar' ? 'مراقبة الذات' : 'SELF-OBSERVED', `${Math.round(state.stats.selfWatchSeconds)}s`],
  ];
  el.auditGrid.innerHTML = audit.map(([k,v]) => `<div class="audit-item"><span>${escapeHtml(k)}</span><strong>${escapeHtml(v)}</strong></div>`).join('');
  showOnly('ending', el.restart);
  audio.alert();
}

function endingCopy(id) {
  const ar = settings.lang === 'ar';
  const table = {
    mirror: ar ? {
      title: 'السجل كان عنك أيضًا',
      body: 'قضيت وقتًا كافيًا في مراقبة المُشغِّل حتى صار واضحًا أن النظام لا يدرس المدينة وحدها. أكثر ما تغيّر خلال التجربة لم يكن دائمًا ما ظهر على الشاشات، بل الطريقة التي اتخذتَ بها قراراتك عندما عرفت أن أداءك نفسه قابل للقياس.'
    } : {
      title: 'THE RECORD INCLUDED YOU',
      body: 'You spent long enough watching the operator to make the final premise explicit: the city was never the only subject. The system measured what you chose to notice, what you ignored, and how your decisions changed once performance itself became visible.'
    },
    perfect_order: ar ? {
      title: 'نظام مثالي',
      body: 'بلغت المؤشرات مستوى تحبه الإدارة. انخفض الاضطراب وصار السلوك متوقعًا. وفي السجل الموازي، انخفضت الراحة والثقة أيضًا. لم يطلب منك أحد تحقيق هذا الثمن؛ ولم يمنعك أحد منه.'
    } : {
      title: 'PERFECT ORDER',
      body: 'Management received the numbers it wanted. Disorder fell and behavior became predictable. In the parallel record, comfort and trust fell with it. Nobody explicitly ordered that trade. Nobody stopped it either.'
    },
    neglect: ar ? {
      title: 'مساحات بلا عين',
      body: 'رفضت توسيع المراقبة بما يكفي لتغطية كل شيء. بقيت مساحات أكثر عفوية، لكن بعض الأذى الفعلي مر من دون تدخل. السجل لا يحوّل هذا إلى درس بسيط؛ فقط يثبت أن عدم استخدام السلطة قرار له أثر أيضًا.'
    } : {
      title: 'UNWATCHED SPACE',
      body: 'You left more room unwatched. Some spaces remained less pressured, but preventable harm also passed without intervention. The record does not turn this into a simple lesson: refusing power is still a choice with consequences.'
    },
    pressure: ar ? {
      title: 'كل شيء صار إشارة',
      body: 'مع الوقت، بدأ التوتر الناتج عن المراقبة نفسه يُقرأ كعلامة خطر، فاستدعى مزيدًا من المراقبة. بعض قراراتك منعت ضررًا حقيقيًا، وبعضها صنع السلوك الذي استُخدم لاحقًا لتبرير الشك.'
    } : {
      title: 'EVERYTHING BECAME A SIGNAL',
      body: 'Over time, stress produced by observation began to look like evidence for more observation. Some interventions prevented real harm. Others helped create the behavior the system later treated as suspicious.'
    },
    measured: ar ? {
      title: 'سلطة محدودة',
      body: 'استخدمت المراقبة عندما وجدت سببًا، وتركت مساحات عندما لم تجد سببًا كافيًا. لم تختفِ الفوضى ولم تصبح المدينة نموذجًا مثاليًا، لكن الفارق بين الخطر الحقيقي وعدم الارتياح بقي واضحًا في معظم قراراتك.'
    } : {
      title: 'LIMITED AUTHORITY',
      body: 'You used observation when you found a reason and left space when evidence was weak. Disorder did not disappear and the city never became perfectly legible, but your record mostly preserved a distinction between actual harm and mere discomfort.'
    },
    ambiguous: ar ? {
      title: 'سجل غير حاسم',
      body: 'لا تعطي أرقامك قصة نظيفة. أحيانًا تدخلت، وأحيانًا انتظرت، وبعض النتائج لم تكن متوقعة. ربما هذه هي المعلومة الأهم في السجل: القياس يستطيع وصف أجزاء من المدينة، لكنه لا يحوّل الحكم البشري إلى معادلة.'
    } : {
      title: 'INCONCLUSIVE RECORD',
      body: 'Your numbers do not produce a clean story. Sometimes you intervened, sometimes you waited, and several outcomes resisted prediction. Perhaps that is the most useful finding: measurement can describe parts of a city without turning judgment into an equation.'
    },
  };
  return table[id] || table.ambiguous;
}

function renderCameraButtons() {
  const alertZones = getActiveEvents(state).map((e) => e.zone).sort().join(',');
  const signature = `${state.selectedCamera}|${state.shift}|${alertZones}|${settings.lang}`;
  if (signature === cameraSignature) return;
  const focusedZone = document.activeElement?.closest?.('.cam-btn')?.dataset.zone || null;
  cameraSignature = signature;
  el.cameraButtons.innerHTML = '';
  for (const zone of ZONES) {
    const locked = zone.id === 'operator' && state.shift < 6;
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `cam-btn${state.selectedCamera === zone.id ? ' active' : ''}${locked ? ' locked' : ''}`;
    btn.disabled = locked;
    btn.dataset.zone = zone.id;
    btn.setAttribute('aria-pressed', String(state.selectedCamera === zone.id));
    const activeAlert = getActiveEvents(state).some((e) => e.zone === zone.id);
    if (activeAlert) btn.classList.add('alerting');
    btn.innerHTML = `${zone.code}<span>${locked ? t('locked') : loc(zone.name)}</span>`;
    btn.addEventListener('click', () => switchCamera(zone.id));
    el.cameraButtons.appendChild(btn);
  }
  if (focusedZone) {
    const replacement = [...el.cameraButtons.querySelectorAll('.cam-btn')]
      .find((button) => button.dataset.zone === focusedZone && !button.disabled);
    replacement?.focus({ preventScroll: true });
  }
}

function switchCamera(id) {
  if (id === 'operator' && state.shift < 6) return;
  if (state.selectedCamera !== id) {
    audio.resume(); audio.switch();
    setCamera(state, id);
    cameraSignature = '';
    signalTimer = settings.reduceMotion ? 0 : .11;
    updateSubjectPanel();
    renderCameraButtons();
  }
}

function selectAtCanvas(clientX, clientY) {
  if (state.selectedCamera === 'operator') return;
  const rect = canvas.getBoundingClientRect();
  const x = (clientX - rect.left) / rect.width;
  const y = (clientY - rect.top) / rect.height;
  const visible = state.subjects.filter((s) => s.zone === state.selectedCamera && !s.absent);
  let best = null;
  let bestDist = .055;
  for (const s of visible) {
    const dx = x - s.px;
    const dy = y - s.py;
    const d = Math.hypot(dx, dy);
    if (d < bestDist) { best = s; bestDist = d; }
  }
  if (best) {
    selectSubject(state, best.id);
    state.focusing = false;
    audio.click();
  } else {
    state.selectedSubject = null;
    state.focusing = false;
  }
  updateSubjectPanel();
}

function doFocus() {
  if (toggleFocus(state)) audio.tone(380, .05, .10);
  else audio.click();
  updateSubjectPanel();
}

function doFlag() {
  const result = flagSelected(state);
  if (!result.ok) return;
  audio.flag();
  const msg = result.justified
    ? (settings.lang === 'ar' ? `تم قبول البلاغ عن ${result.subject.id}. تم إرسال تدخل.` : `Flag on ${result.subject.id} accepted. Intervention dispatched.`)
    : (settings.lang === 'ar' ? `تم تسجيل البلاغ عن ${result.subject.id}. لا يوجد دليل مؤكد.` : `Flag on ${result.subject.id} recorded. No confirmed evidence.`);
  addLog(msg, result.justified ? 'alert' : 'normal');
  updateSubjectPanel();
}

function updateSubjectPanel() {
  const visibleSubjects = state.subjects.filter((s) => s.zone === state.selectedCamera && !s.absent);
  const pickerSignature = `${state.selectedCamera}|${settings.lang}|${visibleSubjects.map((s) => s.id).join(',')}`;
  if (pickerSignature !== subjectPickerSignature) {
    el.subjectSelect.replaceChildren();
    const placeholder = document.createElement('option');
    placeholder.value = '';
    placeholder.textContent = visibleSubjects.length ? t('selectSubject') : t('noVisibleSubjects');
    el.subjectSelect.appendChild(placeholder);
    for (const visible of visibleSubjects) {
      const option = document.createElement('option');
      option.value = visible.id;
      option.textContent = `${visible.id} — ${visible.name}`;
      el.subjectSelect.appendChild(option);
    }
    el.subjectSelect.disabled = visibleSubjects.length === 0;
    subjectPickerSignature = pickerSignature;
    subjectPickerSelection = undefined;
  }
  if (subjectPickerSelection !== state.selectedSubject) {
    el.subjectSelect.value = state.selectedSubject || '';
    subjectPickerSelection = state.selectedSubject;
  }

  const subject = state.subjects.find((s) => s.id === state.selectedSubject && s.zone === state.selectedCamera);
  if (!subject) {
    el.subjectEmpty.textContent = visibleSubjects.length ? t('selectSubject') : t('noVisibleSubjects');
    el.subjectEmpty.classList.remove('hidden');
    el.subjectInfo.classList.add('hidden');
    return;
  }
  el.subjectEmpty.classList.add('hidden');
  el.subjectInfo.classList.remove('hidden');
  el.subjectName.textContent = subject.name;
  el.subjectId.textContent = subject.id;
  el.subjectState.textContent = t(subject.state);
  el.subjectAttention.textContent = `${Math.round(subject.attention)}%`;
  const risk = subjectRisk(subject, getActiveEvents(state));
  const riskKey = risk >= 75 ? 'critical' : risk >= 50 ? 'high' : risk >= 28 ? 'medium' : 'low';
  el.subjectRisk.textContent = t(riskKey);
  el.focusBtn.classList.toggle('active', state.focusing);
  el.focusBtn.textContent = state.focusing ? `${t('focusing')} [E]` : t('focus');
}

function addLog(text, type = 'normal') {
  logItems.unshift({ text, type, time: state.totalElapsed });
  logItems = logItems.slice(0, 18);
  el.log.innerHTML = logItems.map((item) => {
    const mins = Math.floor(item.time / 60).toString().padStart(2,'0');
    const secs = Math.floor(item.time % 60).toString().padStart(2,'0');
    return `<div class="log-line ${item.type}"><b>${mins}:${secs}</b> // ${escapeHtml(item.text)}</div>`;
  }).join('');
}

function announceEvents() {
  for (const event of getActiveEvents(state)) {
    if (announcedEvents.has(event.id)) continue;
    announcedEvents.add(event.id);
    const message = loc(EVENT_TEXT[event.type]);
    addLog(`${message} // ${event.zone.toUpperCase()}`, event.severity >= .5 ? 'alert' : 'normal');
    cameraSignature = '';
    if (event.severity >= .5) audio.alert();
  }
}

function formatClock(seconds) {
  const baseHour = 21;
  const total = Math.floor(seconds * 5.2);
  const h = (baseHour + Math.floor(total / 3600)) % 24;
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return [h,m,s].map((n) => String(n).padStart(2,'0')).join(':');
}

function updateHUD() {
  const metrics = computeGlobalMetrics(state);
  el.orderMeter.style.width = `${metrics.order}%`;
  el.coverageMeter.style.width = `${metrics.coverage}%`;
  el.orderValue.textContent = `${Math.round(metrics.order)}%`;
  el.coverageValue.textContent = `${Math.round(metrics.coverage)}%`;
  el.clockLabel.textContent = formatClock(state.totalElapsed);
  const zone = ZONES.find((z) => z.id === state.selectedCamera) || ZONES[0];
  el.camLabel.textContent = `${zone.code} // ${loc(zone.name)}`;
  el.shiftLabel.textContent = settings.lang === 'ar' ? `الوردية ${String(state.shift).padStart(2,'0')} / 06` : `SHIFT ${String(state.shift).padStart(2,'0')} / 06`;
  updateSubjectPanel();
  renderCameraButtons();
}

function renderScene() {
  const W = canvas.width, H = canvas.height;
  ctx.save();
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = '#d4d4cf';
  ctx.fillRect(0, 0, W, H);
  if (state.selectedCamera === 'operator') drawOperatorRoom(W, H);
  else {
    drawZoneBackground(state.selectedCamera, W, H);
    const active = getActiveEvents(state);
    for (const subject of state.subjects.filter((s) => s.zone === state.selectedCamera && !s.absent)) drawSubject(subject, W, H, active);
  }
  drawNoise(W, H);
  ctx.restore();
}

function drawZoneBackground(zone, W, H) {
  ctx.fillStyle = '#d3d3ce'; ctx.fillRect(0,0,W,H);
  ctx.strokeStyle = '#1a1a1a'; ctx.lineWidth = 3;
  ctx.fillStyle = '#bababa';
  if (zone === 'office') {
    ctx.fillStyle = '#c4c4bf'; ctx.fillRect(0, H*.15, W, H*.60);
    ctx.strokeRect(W*.08,H*.18,W*.24,H*.18); ctx.strokeRect(W*.64,H*.18,W*.24,H*.18);
    for (const x of [.18,.48,.76]) { ctx.fillStyle='#9f9f9c'; ctx.fillRect(W*(x-.09),H*.62,W*.18,H*.06); ctx.fillStyle='#2a2a2a'; ctx.fillRect(W*(x-.06),H*.52,W*.12,H*.09); }
    ctx.fillStyle='#8d8d8a'; ctx.fillRect(W*.48,H*.12,W*.04,H*.51);
  } else if (zone === 'cafe') {
    ctx.fillStyle='#b7b7b2'; ctx.fillRect(0,H*.08,W,H*.19);
    ctx.fillStyle='#ecece6'; ctx.fillRect(0,H*.27,W,H*.49);
    for (const x of [.24,.5,.76]) { ctx.beginPath(); ctx.arc(W*x,H*.63,52,0,Math.PI*2); ctx.stroke(); ctx.fillStyle='#a5a5a0'; ctx.fill(); }
    ctx.fillStyle='#555'; ctx.fillRect(W*.08,H*.25,W*.20,H*.025); ctx.fillRect(W*.72,H*.25,W*.18,H*.025);
  } else if (zone === 'square') {
    ctx.fillStyle='#e2e2dc'; ctx.fillRect(0,0,W,H*.72);
    ctx.fillStyle='#b0b0aa'; ctx.fillRect(0,H*.72,W,H*.28);
    ctx.strokeStyle='#8b8b87'; ctx.lineWidth=2;
    for(let x=-100;x<W+100;x+=120){ctx.beginPath();ctx.moveTo(x,H*.72);ctx.lineTo(x+200,H);ctx.stroke();}
    ctx.fillStyle='#565653'; ctx.fillRect(W*.45,H*.33,W*.10,H*.39); ctx.fillStyle='#a6a6a1'; ctx.fillRect(W*.41,H*.31,W*.18,H*.04);
    ctx.fillStyle='#2b2b2a'; ctx.fillRect(W*.05,H*.22,W*.17,H*.18);
  } else if (zone === 'alley') {
    ctx.fillStyle='#aaa'; ctx.fillRect(0,0,W,H);
    ctx.fillStyle='#d8d8d2'; ctx.fillRect(W*.10,H*.08,W*.80,H*.78);
    ctx.fillStyle='#4f4f4d'; ctx.fillRect(W*.13,H*.18,W*.19,H*.36); ctx.fillRect(W*.68,H*.16,W*.16,H*.40);
    ctx.strokeStyle='#5d5d5a'; ctx.lineWidth=7; ctx.beginPath();ctx.moveTo(W*.09,H*.82);ctx.lineTo(W*.91,H*.82);ctx.stroke();
    ctx.fillStyle='#777'; ctx.fillRect(W*.44,H*.30,W*.12,H*.24);
  } else if (zone === 'transit') {
    ctx.fillStyle='#c7c7c2'; ctx.fillRect(0,0,W,H*.74);
    ctx.fillStyle='#7d7d79'; ctx.fillRect(0,H*.74,W,H*.26);
    ctx.fillStyle='#2e2e2d'; ctx.fillRect(W*.08,H*.15,W*.84,H*.05);
    for(let x=.18;x<.9;x+=.18){ctx.fillStyle='#666';ctx.fillRect(W*x,H*.20,W*.018,H*.52);}
    ctx.fillStyle='#ebebe5'; ctx.fillRect(W*.34,H*.28,W*.34,H*.16); ctx.strokeRect(W*.34,H*.28,W*.34,H*.16);
    ctx.fillStyle='#444'; ctx.fillRect(W*.38,H*.33,W*.26,H*.045);
  }
  ctx.fillStyle='rgba(0,0,0,.10)'; ctx.fillRect(0,H*.86,W,H*.14);
}

function drawSubject(s, W, H, events) {
  const x = s.px * W, y = s.py * H;
  const selected = state.selectedSubject === s.id;
  const focused = selected && state.focusing;
  const event = events.find((e) => e.actor === s.id);
  const scale = s.routine === 'child' ? .78 : 1;
  ctx.save(); ctx.translate(x,y);
  if (selected) {
    ctx.strokeStyle = focused ? '#b00000' : '#111'; ctx.lineWidth = focused ? 6 : 3;
    ctx.strokeRect(-34*scale,-98*scale,68*scale,105*scale);
    if (focused) {
      ctx.beginPath(); ctx.arc(0,-48*scale,47*scale,0,Math.PI*2); ctx.stroke();
      ctx.beginPath();ctx.moveTo(-62*scale,-48*scale);ctx.lineTo(62*scale,-48*scale);ctx.moveTo(0,-108*scale);ctx.lineTo(0,12*scale);ctx.stroke();
    }
  }
  ctx.fillStyle = '#191919'; ctx.beginPath(); ctx.arc(0,-72*scale,18*scale,0,Math.PI*2); ctx.fill();
  ctx.lineWidth = 12*scale; ctx.strokeStyle = '#191919'; ctx.lineCap='round';
  ctx.beginPath(); ctx.moveTo(0,-50*scale); ctx.lineTo(0,-8*scale); ctx.moveTo(0,-35*scale);ctx.lineTo(-21*scale,-12*scale); ctx.moveTo(0,-35*scale);ctx.lineTo(21*scale,-12*scale); ctx.moveTo(0,-8*scale);ctx.lineTo(-18*scale,25*scale);ctx.moveTo(0,-8*scale);ctx.lineTo(18*scale,25*scale);ctx.stroke();
  if (s.state === 'stressed' || s.state === 'withdrawn') {
    ctx.strokeStyle='#555';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(-26*scale,-78*scale);ctx.lineTo(-37*scale,-88*scale);ctx.moveTo(25*scale,-80*scale);ctx.lineTo(38*scale,-91*scale);ctx.stroke();
  }
  if (event) { ctx.fillStyle = event.severity >= .5 ? '#a00000' : '#333'; ctx.fillRect(-5,-130*scale,10,10); }
  if (s.flags > 0) { ctx.fillStyle='#9a0000';ctx.fillRect(19*scale,-99*scale,14,14); }
  ctx.restore();
}

function drawOperatorRoom(W,H) {
  ctx.fillStyle='#151515';ctx.fillRect(0,0,W,H);
  ctx.fillStyle='#292929';ctx.fillRect(W*.12,H*.12,W*.76,H*.66);
  ctx.fillStyle='#050505';ctx.fillRect(W*.20,H*.18,W*.60,H*.34);
  ctx.strokeStyle='#777';ctx.lineWidth=3;ctx.strokeRect(W*.20,H*.18,W*.60,H*.34);
  ctx.fillStyle='#d0d0ca';ctx.fillRect(W*.24,H*.22,W*.52,H*.26);
  ctx.fillStyle='#101010';ctx.font='28px monospace';ctx.textAlign='center';ctx.fillText('WATCHED',W*.50,H*.36);
  ctx.fillStyle='#111';ctx.beginPath();ctx.arc(W*.50,H*.59,30,0,Math.PI*2);ctx.fill();
  ctx.strokeStyle='#111';ctx.lineWidth=24;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(W*.50,H*.63);ctx.lineTo(W*.50,H*.74);ctx.moveTo(W*.50,H*.67);ctx.lineTo(W*.43,H*.73);ctx.moveTo(W*.50,H*.67);ctx.lineTo(W*.57,H*.73);ctx.stroke();
  ctx.strokeStyle='#8e0000';ctx.lineWidth=4;ctx.strokeRect(W*.39,H*.53,W*.22,H*.23);
  ctx.fillStyle='#a00000';ctx.font='18px monospace';ctx.textAlign='left';ctx.fillText('SUBJECT 01 / OPERATOR',W*.39,H*.50);
  const focusPct = state.totalElapsed ? Math.round(state.stats.focusSeconds/state.totalElapsed*100) : 0;
  ctx.fillStyle='#bdbdbd';ctx.font='16px monospace';
  const lines = [`CAMERA SWITCHES: ${state.stats.cameraSwitches}`,`FLAGS: ${state.stats.flags}`,`FALSE FLAGS: ${state.stats.falseFlags}`,`FOCUS RATIO: ${focusPct}%`];
  lines.forEach((line,i)=>ctx.fillText(line,W*.66,H*(.62+i*.045)));
}

function drawNoise(W,H) {
  const intensity = settings.reduceMotion ? 20 : 55;
  ctx.fillStyle='rgba(0,0,0,.08)';
  const seed = Math.floor(state.totalElapsed*7);
  for(let i=0;i<intensity;i++){
    const x = hash(seed+i*17)*W;
    const y = hash(seed+i*31+4)*H;
    ctx.fillRect(x,y,1+hash(i)*3,1);
  }
  ctx.fillStyle='rgba(0,0,0,.12)';ctx.fillRect(0,0,12,H);ctx.fillRect(W-12,0,12,H);ctx.fillRect(0,H-9,W,9);
}

function hash(n) { const x = Math.sin(n * 12.9898) * 43758.5453; return x - Math.floor(x); }
function escapeHtml(s) { return String(s).replace(/[&<>'"]/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c])); }

function frame(now) {
  const rawDt = (now - lastFrame) / 1000;
  lastFrame = now;
  const dt = Math.min(rawDt, .1);
  if (signalTimer > 0) { signalTimer -= dt; el.signalLoss.classList.remove('hidden'); }
  else el.signalLoss.classList.add('hidden');
  if (state.started && !state.paused && !state.finished && el.briefing.classList.contains('hidden')) {
    tickState(state, dt);
    announceEvents();
    const shift = SHIFTS[state.shift - 1];
    if (shift && state.shiftElapsed >= shift.duration) completeShift();
    if (state.totalElapsed - lastSaveAt > 6) { lastSaveAt = state.totalElapsed; saveGame(); }
  }
  renderScene();
  updateHUD();
  requestAnimationFrame(frame);
}

function pauseGame() {
  if (!state.started || state.finished) return;
  state.paused = true; state.focusing = false; saveGame(); showOnly('pause', el.resume);
}
function resumeGame() { audio.resume(); state.paused = false; state.started = true; showOnly(null, el.pauseBtn); lastFrame = performance.now(); }
function backToMenu() {
  saveGame();
  state.paused = true;
  const canContinue = hasSave();
  el.continueGame.classList.toggle('hidden', !canContinue);
  showOnly('menu', canContinue ? el.continueGame : el.newGame);
}

canvas.addEventListener('pointerdown', (e) => { if (state.started && !state.paused) selectAtCanvas(e.clientX,e.clientY); });
el.subjectSelect.addEventListener('change', () => {
  const id = el.subjectSelect.value;
  if (!id) {
    state.selectedSubject = null;
    state.focusing = false;
    updateSubjectPanel();
    return;
  }
  const subject = selectSubject(state, id);
  if (!subject) {
    updateSubjectPanel();
    return;
  }
  state.focusing = false;
  audio.click();
  updateSubjectPanel();
});
el.focusBtn.addEventListener('click', doFocus);
el.flagBtn.addEventListener('click', doFlag);
el.newGame.addEventListener('click', startNewGame);
el.continueGame.addEventListener('click', continueGame);
el.startShift.addEventListener('click', beginShift);
el.pauseBtn.addEventListener('click', pauseGame);
el.resume.addEventListener('click', resumeGame);
el.pauseSettings.addEventListener('click', () => openSettings('pause'));
el.quit.addEventListener('click', backToMenu);
el.settingsBtn.addEventListener('click', () => openSettings('game'));
el.menuSettings.addEventListener('click', () => openSettings('menu'));
el.closeSettings.addEventListener('click', () => { closeSettings(); if (preSettingsOverlay === 'game') state.paused = pausedBeforeSettings; });
el.restart.addEventListener('click', startNewGame);
el.resetProgress.addEventListener('click', () => {
  if (!storage.remove(SAVE_KEY)) {
    el.saveLabel.textContent = settings.lang === 'ar' ? 'تعذر إعادة ضبط التقدم' : 'PROGRESS RESET FAILED';
    return;
  }
  state = createInitialState();
  logItems = []; announcedEvents.clear(); cameraSignature = '';
  el.continueGame.classList.add('hidden');
  el.settings.classList.add('hidden');
  preSettingsOverlay = 'menu';
  showOnly('menu', el.newGame);
});

el.language.addEventListener('change', () => { settings.lang = el.language.value; persistSettings(); applySettings(); if (!el.briefing.classList.contains('hidden')) showBriefing(); });
el.volume.addEventListener('input', () => { settings.volume = Number(el.volume.value); audio.setVolume(settings.volume/100); persistSettings(); });
el.scanlines.addEventListener('change', () => { settings.scanlines = el.scanlines.checked; persistSettings(); applySettings(); });
el.motion.addEventListener('change', () => { settings.reduceMotion = el.motion.checked; persistSettings(); applySettings(); });

window.addEventListener('keydown', (e) => {
  if (e.repeat) return;
  if (e.key === 'Escape') {
    if (!el.settings.classList.contains('hidden')) return el.closeSettings.click();
    if (!el.pause.classList.contains('hidden')) return resumeGame();
    return pauseGame();
  }
  if (['INPUT','SELECT','TEXTAREA'].includes(document.activeElement?.tagName)) return;
  if (!state.started || state.paused) return;
  if (e.key.toLowerCase() === 'e') { e.preventDefault(); doFocus(); }
  if (e.key.toLowerCase() === 'f') { e.preventDefault(); doFlag(); }
  const digit = Number(e.key);
  if (digit >= 1 && digit <= 5) switchCamera(ZONES[digit-1].id);
  if (e.key === '0' && state.shift >= 6) switchCamera('operator');
});

document.addEventListener('visibilitychange', () => { if (document.hidden && state.started && !state.paused) pauseGame(); });
window.addEventListener('beforeunload', saveGame);

applySettings();
el.continueGame.classList.toggle('hidden', !hasSave());
showOnly('menu', el.newGame);
renderScene();
requestAnimationFrame(frame);

