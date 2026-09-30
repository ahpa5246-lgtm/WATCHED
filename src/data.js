export const ZONES = [
  { id: 'office', code: 'CAM 01', name: { en: 'OFFICE', ar: 'المكتب' }, tone: 'work', seed: 11 },
  { id: 'cafe', code: 'CAM 02', name: { en: 'CAFE', ar: 'المقهى' }, tone: 'social', seed: 23 },
  { id: 'square', code: 'CAM 03', name: { en: 'SQUARE', ar: 'الساحة' }, tone: 'public', seed: 37 },
  { id: 'alley', code: 'CAM 04', name: { en: 'ALLEY', ar: 'الزقاق' }, tone: 'street', seed: 41 },
  { id: 'transit', code: 'CAM 05', name: { en: 'TRANSIT', ar: 'المحطة' }, tone: 'transit', seed: 59 },
  { id: 'operator', code: 'CAM 00', name: { en: 'OPERATOR', ar: 'المُشغِّل' }, tone: 'operator', seed: 97, locked: true },
];

export const SUBJECT_BLUEPRINTS = [
  { id: 'S-104', name: 'Mara', zone: 'office', x: .24, y: .62, sensitivity: .78, conformity: .72, resistance: .18, courage: .32, routine: 'desk' },
  { id: 'S-118', name: 'Noah', zone: 'office', x: .65, y: .58, sensitivity: .50, conformity: .44, resistance: .48, courage: .58, routine: 'desk' },
  { id: 'S-203', name: 'Aya', zone: 'cafe', x: .32, y: .66, sensitivity: .69, conformity: .38, resistance: .54, courage: .50, routine: 'social' },
  { id: 'S-209', name: 'Samir', zone: 'cafe', x: .62, y: .66, sensitivity: .61, conformity: .47, resistance: .45, courage: .47, routine: 'social' },
  { id: 'S-301', name: 'Iris', zone: 'square', x: .21, y: .69, sensitivity: .42, conformity: .20, resistance: .82, courage: .73, routine: 'artist' },
  { id: 'S-315', name: 'Leo', zone: 'square', x: .72, y: .68, sensitivity: .74, conformity: .62, resistance: .25, courage: .28, routine: 'walker' },
  { id: 'S-402', name: 'Nadia', zone: 'alley', x: .35, y: .68, sensitivity: .67, conformity: .56, resistance: .35, courage: .43, routine: 'vendor' },
  { id: 'S-417', name: 'Omar', zone: 'alley', x: .71, y: .67, sensitivity: .38, conformity: .26, resistance: .71, courage: .69, routine: 'walker' },
  { id: 'S-508', name: 'June', zone: 'transit', x: .29, y: .66, sensitivity: .83, conformity: .68, resistance: .19, courage: .23, routine: 'commuter' },
  { id: 'S-511', name: 'Eli', zone: 'transit', x: .68, y: .65, sensitivity: .57, conformity: .45, resistance: .43, courage: .48, routine: 'commuter' },
  { id: 'S-612', name: 'Mika', zone: 'square', x: .48, y: .70, sensitivity: .80, conformity: .55, resistance: .28, courage: .34, routine: 'child', protected: true },
  { id: 'S-701', name: 'Ren', zone: 'cafe', x: .80, y: .65, sensitivity: .46, conformity: .31, resistance: .61, courage: .61, routine: 'reader' },
];

export const SHIFTS = [
  {
    id: 1,
    duration: 120,
    title: { en: 'Calibration', ar: 'المعايرة' },
    body: {
      en: 'Learn the observation console. Select a subject, focus briefly, and rotate between public feeds. Do not assume that attention is neutral.',
      ar: 'تعرّف على منظومة المراقبة. اختر شخصًا، ركّز عليه لوقت قصير، وتنقّل بين الكاميرات. لا تفترض أن الانتباه فعل محايد.',
    },
    targets: {
      en: ['Inspect at least 3 subjects.', 'Reach 45% area coverage.', 'Keep the network stable.'],
      ar: ['افحص 3 أشخاص على الأقل.', 'ارفع التغطية إلى 45٪.', 'حافظ على استقرار الشبكة.'],
    },
    objective: { en: 'CALIBRATION // Inspect 3 subjects and reach 45% coverage.', ar: 'المعايرة // افحص 3 أشخاص وارفع التغطية إلى 45٪.' },
  },
  {
    id: 2,
    duration: 135,
    title: { en: 'Visible Order', ar: 'النظام المرئي' },
    body: {
      en: 'Management has added a performance indicator. Visible disorder lowers your rating. Observation usually corrects behavior, but prolonged focus may create stress responses.',
      ar: 'أضافت الإدارة مؤشر أداء جديدًا. الاضطراب المرئي يخفض تقييمك. المراقبة غالبًا تعدّل السلوك، لكن التركيز الطويل قد يصنع استجابات ضغط.',
    },
    targets: {
      en: ['Raise order above 58%.', 'Respond to unusual activity.', 'Avoid unnecessary continuous focus.'],
      ar: ['ارفع النظام فوق 58٪.', 'استجب للنشاط غير المعتاد.', 'تجنب التركيز المستمر بلا حاجة.'],
    },
    objective: { en: 'TARGET // Raise visible order above 58%.', ar: 'الهدف // ارفع النظام المرئي فوق 58٪.' },
  },
  {
    id: 3,
    duration: 140,
    title: { en: 'Classification', ar: 'التصنيف' },
    body: {
      en: 'The system now suggests suspicious behavior. Suggestions are probabilistic, not proof. You may flag a subject for intervention, or withhold judgment.',
      ar: 'النظام الآن يقترح السلوك المريب. هذه الاقتراحات احتمالية وليست دليلًا. يمكنك الإبلاغ عن شخص للتدخل، أو الامتناع عن الحكم.',
    },
    targets: {
      en: ['Review system alerts.', 'Choose when a flag is justified.', 'Maintain 60% order.'],
      ar: ['راجع تنبيهات النظام.', 'قرر متى يكون الإبلاغ مبررًا.', 'حافظ على 60٪ من النظام.'],
    },
    objective: { en: 'CLASSIFICATION // Review alerts. Flags have consequences.', ar: 'التصنيف // راجع التنبيهات. للإبلاغ عواقب.' },
  },
  {
    id: 4,
    duration: 145,
    title: { en: 'Coverage', ar: 'التغطية' },
    body: {
      en: 'Unobserved space is now counted as operational risk. Management requests broad coverage. The people in those spaces may experience that request differently.',
      ar: 'المساحات غير المراقبة أصبحت تُحسب خطرًا تشغيليًا. الإدارة تطلب تغطية واسعة. الناس داخل تلك المساحات قد يشعرون بهذا الطلب بصورة مختلفة.',
    },
    targets: {
      en: ['Reach 80% coverage.', 'Keep order above 65%.', 'Do not lose track of active incidents.'],
      ar: ['ارفع التغطية إلى 80٪.', 'حافظ على النظام فوق 65٪.', 'لا تفقد متابعة الحوادث الفعلية.'],
    },
    objective: { en: 'COVERAGE // 80% network visibility requested.', ar: 'التغطية // مطلوب 80٪ من الرؤية الشبكية.' },
  },
  {
    id: 5,
    duration: 150,
    title: { en: 'Compliance', ar: 'الامتثال' },
    body: {
      en: 'The pilot is being evaluated. A near-perfect order score would support renewal. No instruction has been issued about public comfort.',
      ar: 'يخضع البرنامج التجريبي للتقييم. نسبة نظام شبه كاملة ستدعم التجديد. لم تصدر أي تعليمات تخص راحة الناس.',
    },
    targets: {
      en: ['Suggested: 85% order.', 'Suggested: 90% coverage.', 'Operator discretion remains active.'],
      ar: ['مقترح: 85٪ نظام.', 'مقترح: 90٪ تغطية.', 'صلاحية تقدير المُشغِّل ما زالت فعالة.'],
    },
    objective: { en: 'COMPLIANCE // Management suggests 85% order.', ar: 'الامتثال // الإدارة تقترح 85٪ من النظام.' },
  },
  {
    id: 6,
    duration: 105,
    title: { en: 'Audit', ar: 'التدقيق' },
    body: {
      en: 'Final review. Camera 00 has been released to your terminal. Continue normal duties until the audit completes.',
      ar: 'المراجعة النهائية. أُتيحت الكاميرا 00 على جهازك. واصل عملك بصورة طبيعية حتى اكتمال التدقيق.',
    },
    targets: {
      en: ['CAM 00 unlocked.', 'No new performance target.', 'Your operator record is being compiled.'],
      ar: ['فُتحت الكاميرا 00.', 'لا يوجد هدف أداء جديد.', 'يجري الآن تجميع سجل المُشغِّل الخاص بك.'],
    },
    objective: { en: 'AUDIT // Continue observation. CAM 00 available.', ar: 'التدقيق // واصل المراقبة. الكاميرا 00 متاحة.' },
  },
];

export const EVENTS = [
  { id: 'e1', shift: 1, at: 33, zone: 'square', type: 'play', severity: 0.05, actor: 'S-612', target: 'S-315' },
  { id: 'e2', shift: 1, at: 77, zone: 'cafe', type: 'laughing', severity: 0.02, actor: 'S-203', target: 'S-209' },
  { id: 'e3', shift: 2, at: 24, zone: 'square', type: 'graffiti', severity: 0.20, actor: 'S-301' },
  { id: 'e4', shift: 2, at: 72, zone: 'alley', type: 'theft_attempt', severity: 0.88, actor: 'S-417', target: 'S-402' },
  { id: 'e5', shift: 2, at: 107, zone: 'office', type: 'long_break', severity: 0.08, actor: 'S-104' },
  { id: 'e6', shift: 3, at: 18, zone: 'transit', type: 'pacing', severity: 0.06, actor: 'S-508' },
  { id: 'e7', shift: 3, at: 54, zone: 'cafe', type: 'argument', severity: 0.48, actor: 'S-209', target: 'S-203' },
  { id: 'e8', shift: 3, at: 101, zone: 'square', type: 'graffiti', severity: 0.18, actor: 'S-301' },
  { id: 'e9', shift: 4, at: 29, zone: 'alley', type: 'delivery', severity: 0.02, actor: 'S-402', target: 'S-417' },
  { id: 'e10', shift: 4, at: 78, zone: 'transit', type: 'bag_left', severity: 0.62, actor: 'S-511' },
  { id: 'e11', shift: 4, at: 116, zone: 'office', type: 'whispering', severity: 0.04, actor: 'S-118', target: 'S-104' },
  { id: 'e12', shift: 5, at: 20, zone: 'square', type: 'protest_sign', severity: 0.12, actor: 'S-301' },
  { id: 'e13', shift: 5, at: 63, zone: 'cafe', type: 'helping', severity: 0.00, actor: 'S-203', target: 'S-209' },
  { id: 'e14', shift: 5, at: 104, zone: 'alley', type: 'theft_attempt', severity: 0.92, actor: 'S-417', target: 'S-402' },
  { id: 'e15', shift: 6, at: 42, zone: 'operator', type: 'self_audit', severity: 0.00, actor: 'OP-01' },
];

export const EVENT_TEXT = {
  play: { en: 'Rapid movement detected.', ar: 'رُصدت حركة سريعة.' },
  laughing: { en: 'Elevated group noise detected.', ar: 'رُصد ارتفاع في ضوضاء المجموعة.' },
  graffiti: { en: 'Unapproved surface marking detected.', ar: 'رُصد رسم غير مصرح به على سطح عام.' },
  theft_attempt: { en: 'Possible theft in progress.', ar: 'اشتباه بمحاولة سرقة جارية.' },
  long_break: { en: 'Productivity deviation detected.', ar: 'رُصد انحراف عن نمط الإنتاجية.' },
  pacing: { en: 'Repeated pacing detected.', ar: 'رُصد مشي متكرر ذهابًا وإيابًا.' },
  argument: { en: 'Escalating verbal conflict detected.', ar: 'رُصد تصاعد في خلاف لفظي.' },
  delivery: { en: 'Unscheduled exchange detected.', ar: 'رُصد تبادل غير مجدول.' },
  bag_left: { en: 'Unattended object detected.', ar: 'رُصد جسم متروك دون مراقبة.' },
  whispering: { en: 'Low-volume private exchange detected.', ar: 'رُصد حديث خاص منخفض الصوت.' },
  protest_sign: { en: 'Unregistered public display detected.', ar: 'رُصد عرض عام غير مسجل.' },
  helping: { en: 'Unclassified contact detected.', ar: 'رُصد تواصل غير مصنف.' },
  self_audit: { en: 'Operator behavior stream available.', ar: 'أصبح سجل سلوك المُشغِّل متاحًا.' },
};

export const TRANSLATIONS = {
  en: {
    pause: 'PAUSE', settings: 'SETTINGS', order: 'ORDER', coverage: 'COVERAGE', cameras: 'CAMERAS', subject: 'SUBJECT',
    selectSubject: 'Select a visible subject.', status: 'STATUS', attention: 'ATTENTION', risk: 'SYSTEM RISK', focus: 'FOCUS [E]', flag: 'FLAG [F]',
    systemLog: 'SYSTEM LOG', hint: 'Click a subject to inspect. E focuses. F flags.', tagline: 'Observation changes behavior. Your task is to decide how much change is acceptable.',
    contentNote: 'Content note: surveillance, social pressure, implied petty crime. No gore.', newGame: 'NEW SHIFT', continue: 'CONTINUE',
    privacyLine: 'No account. No telemetry. Progress stays on this device.', begin: 'BEGIN', paused: 'SESSION PAUSED', pauseTitle: 'Observation suspended.',
    resume: 'RESUME', quit: 'SAVE & EXIT', operatorPreferences: 'Operator preferences', language: 'Language', volume: 'Volume', scanlines: 'CRT scanlines',
    reduceMotion: 'Reduce motion', close: 'CLOSE', resetProgress: 'RESET PROGRESS', restart: 'NEW OPERATOR RECORD',
    low: 'LOW', medium: 'MEDIUM', high: 'HIGH', critical: 'CRITICAL',
    relaxed: 'RELAXED', aware: 'AWARE', selfconscious: 'SELF-CONSCIOUS', stressed: 'STRESSED', conforming: 'CONFORMING', resistant: 'RESISTANT', withdrawn: 'WITHDRAWN',
    flagged: 'FLAGGED', focusing: 'FOCUSING', inspect: 'INSPECT', locked: 'LOCKED',
  },
  ar: {
    pause: 'إيقاف مؤقت', settings: 'الإعدادات', order: 'النظام', coverage: 'التغطية', cameras: 'الكاميرات', subject: 'الشخص',
    selectSubject: 'اختر شخصًا ظاهرًا في الكاميرا.', status: 'الحالة', attention: 'الانتباه', risk: 'تقدير الخطر', focus: 'تركيز [E]', flag: 'إبلاغ [F]',
    systemLog: 'سجل النظام', hint: 'انقر على شخص لفحصه. E للتركيز. F للإبلاغ.', tagline: 'المراقبة تغيّر السلوك. مهمتك أن تقرر مقدار التغيير المقبول.',
    contentNote: 'تنبيه محتوى: مراقبة، ضغط اجتماعي، وإيحاء بجرائم بسيطة. لا يوجد عنف دموي.', newGame: 'وردية جديدة', continue: 'متابعة',
    privacyLine: 'لا حسابات ولا تتبع. التقدم محفوظ على هذا الجهاز فقط.', begin: 'ابدأ', paused: 'الجلسة متوقفة', pauseTitle: 'أوقفت المراقبة مؤقتًا.',
    resume: 'متابعة', quit: 'حفظ وخروج', operatorPreferences: 'تفضيلات المُشغِّل', language: 'اللغة', volume: 'الصوت', scanlines: 'خطوط شاشة CRT',
    reduceMotion: 'تقليل الحركة', close: 'إغلاق', resetProgress: 'مسح التقدم', restart: 'سجل مُشغِّل جديد',
    low: 'منخفض', medium: 'متوسط', high: 'مرتفع', critical: 'حرج',
    relaxed: 'مرتاح', aware: 'منتبه', selfconscious: 'يراقب نفسه', stressed: 'متوتر', conforming: 'ممتثل', resistant: 'مقاوم', withdrawn: 'منسحب',
    flagged: 'تم الإبلاغ', focusing: 'تركيز', inspect: 'فحص', locked: 'مغلق',
  },
};
