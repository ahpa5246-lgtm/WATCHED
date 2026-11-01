import { expect, test } from '@playwright/test';

test('a paused operator can inspect settings and return to the paused session', async ({ page }, testInfo) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'NEW SHIFT' }).click();
  await page.getByRole('button', { name: 'BEGIN' }).click();
  await page.getByRole('button', { name: 'PAUSE' }).click();

  const pause = page.locator('#pauseOverlay');
  await expect(pause).toBeVisible();
  await pause.getByRole('button', { name: 'SETTINGS' }).click();
  await expect(page.locator('#settingsOverlay')).toBeVisible();
  await expect(pause).toBeHidden();

  await page.getByRole('button', { name: 'CLOSE' }).click();
  await expect(pause).toBeVisible();
  await expect(page.locator('#settingsOverlay')).toBeHidden();

  await page.getByRole('button', { name: 'RESUME' }).click();
  await expect(pause).toBeHidden();
  await expect(page.locator('#gameCanvas')).toBeVisible();
  await page.screenshot({
    path: testInfo.outputPath(`${testInfo.project.name}-resumed-session.png`),
    fullPage: true,
  });
});

test('a valid local record survives exit and reload', async ({ page }, testInfo) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'NEW SHIFT' }).click();
  await page.getByRole('button', { name: 'BEGIN' }).click();
  await page.getByRole('button', { name: 'PAUSE' }).click();
  await page.getByRole('button', { name: 'SAVE & EXIT' }).click();

  await expect(page.getByRole('button', { name: 'CONTINUE' })).toBeVisible();
  await page.reload();
  await page.getByRole('button', { name: 'CONTINUE' }).click();

  await expect(page.locator('#menuOverlay')).toBeHidden();
  await expect(page.locator('#logEntries')).toContainText('Operator record restored.');
  await expect(page.locator('#gameCanvas')).toBeVisible();
  await page.screenshot({
    path: testInfo.outputPath(`${testInfo.project.name}-continued-session.png`),
    fullPage: true,
  });
});

test('a corrupt local record never exposes Continue', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('watched.save.v1', '{broken json');
  });
  await page.goto('/');

  await expect(page.getByRole('button', { name: 'CONTINUE' })).toBeHidden();
  await expect(page.getByRole('button', { name: 'NEW SHIFT' })).toBeVisible();
});

test('narrow status remains visible while console content stays reachable', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'narrow-760', 'narrow viewport acceptance');

  await page.goto('/');
  await page.getByRole('button', { name: 'NEW SHIFT' }).click();
  await page.getByRole('button', { name: 'BEGIN' }).click();

  const viewport = page.viewportSize();
  const status = page.locator('.statusbar');
  const statusBox = await status.boundingBox();

  expect(viewport).not.toBeNull();
  expect(statusBox).not.toBeNull();
  expect(statusBox.y).toBeGreaterThanOrEqual(0);
  expect(statusBox.y + statusBox.height).toBeLessThanOrEqual(viewport.height);

  const documentGeometry = await page.evaluate(() => ({
    clientHeight: document.documentElement.clientHeight,
    scrollHeight: document.documentElement.scrollHeight,
  }));
  expect(documentGeometry.scrollHeight).toBeLessThanOrEqual(documentGeometry.clientHeight);

  const consoleGrid = page.locator('.console-grid');
  const consoleGeometry = await consoleGrid.evaluate((element) => ({
    clientHeight: element.clientHeight,
    scrollHeight: element.scrollHeight,
  }));
  expect(consoleGeometry.scrollHeight).toBeGreaterThan(consoleGeometry.clientHeight);

  await consoleGrid.evaluate((element) => {
    element.scrollTop = element.scrollHeight;
  });
  await expect(page.locator('.event-log')).toBeInViewport();
  await consoleGrid.evaluate((element) => {
    element.scrollTop = 0;
  });

  await page.screenshot({
    path: testInfo.outputPath('narrow-operator-frame.png'),
  });
});

test('blocked browser storage keeps the operator usable without claiming persistence', async ({ page }) => {
  await page.addInitScript(() => {
    const blocked = () => {
      throw new DOMException('Storage access denied', 'SecurityError');
    };
    for (const method of ['getItem', 'setItem', 'removeItem']) {
      Object.defineProperty(Storage.prototype, method, {
        configurable: true,
        writable: true,
        value: blocked,
      });
    }
  });

  await page.goto('/');
  await expect(page.getByRole('button', { name: 'NEW SHIFT' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'CONTINUE' })).toBeHidden();
  await expect(page.locator('#saveLabel')).toHaveText('LOCAL STORAGE UNAVAILABLE');

  await page.getByRole('button', { name: 'NEW SHIFT' }).click();
  await page.getByRole('button', { name: 'BEGIN' }).click();
  await expect(page.locator('#saveLabel')).toHaveText('LOCAL SAVE FAILED');

  await page.getByRole('button', { name: 'PAUSE' }).click();
  await page.locator('#pauseOverlay').getByRole('button', { name: 'SETTINGS' }).click();
  await expect(page.locator('#settingsOverlay')).toBeVisible();
  await page.getByRole('button', { name: 'RESET PROGRESS' }).click();
  await expect(page.locator('#saveLabel')).toHaveText('PROGRESS RESET FAILED');
  await expect(page.locator('#settingsOverlay')).toBeVisible();
});


test('keyboard-only operator journey contains modal focus and restores the correct task', async ({ page }, testInfo) => {
  await page.goto('/');
  const app = page.locator('#app');
  const menuDialog = page.getByRole('dialog', { name: 'WATCHED' });

  await expect(menuDialog).toBeVisible();
  await expect(page.locator('#newGameBtn')).toBeFocused();
  await expect(app).toHaveJSProperty('inert', true);
  await expect(app).toHaveAttribute('aria-hidden', 'true');

  await page.keyboard.press('Enter');
  await expect(page.locator('#startShiftBtn')).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(page.locator('#startShiftBtn')).toBeFocused();
  await page.keyboard.press('Enter');

  await expect(app).toHaveJSProperty('inert', false);
  await expect(page.locator('#pauseBtn')).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(page.locator('#resumeBtn')).toBeFocused();

  await page.keyboard.press('Shift+Tab');
  await expect(page.locator('#quitBtn')).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(page.locator('#resumeBtn')).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(page.locator('#pauseSettingsBtn')).toBeFocused();
  await page.keyboard.press('Enter');

  await expect(page.locator('#languageSelect')).toBeFocused();
  await expect(app).toHaveJSProperty('inert', true);
  await page.keyboard.press('ArrowDown');
  await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
  await page.keyboard.press('Tab');
  await expect(page.locator('#volumeRange')).toBeFocused();
  await page.screenshot({ path: testInfo.outputPath('arabic-settings-keyboard.png'), fullPage: true });

  await page.keyboard.press('Tab');
  await expect(page.locator('#scanlinesToggle')).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(page.locator('#motionToggle')).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(page.locator('#closeSettingsBtn')).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(page.locator('#resetProgressBtn')).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(page.locator('#languageSelect')).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(page.locator('#pauseSettingsBtn')).toBeFocused();
  await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');

  await page.keyboard.press('Shift+Tab');
  await expect(page.locator('#resumeBtn')).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('#pauseBtn')).toBeFocused();
  await expect(app).toHaveJSProperty('inert', false);

  await page.keyboard.press('Escape');
  await expect(page.locator('#resumeBtn')).toBeFocused();
  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');
  await expect(page.locator('#quitBtn')).toBeFocused();
  await page.keyboard.press('Enter');

  await expect(page.locator('#continueBtn')).toBeFocused();
  await expect(menuDialog).toBeVisible();
  await page.keyboard.press('Enter');
  await expect(page.locator('#menuOverlay')).toBeHidden();
  await expect(page.locator('#pauseBtn')).toBeFocused();
  await expect(app).toHaveJSProperty('inert', false);
});

test('keyboard-only operator can switch cameras and inspect a visible subject without canvas input', async ({ page }, testInfo) => {
  await page.goto('/');
  await page.keyboard.press('Enter');
  await expect(page.locator('#startShiftBtn')).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('#pauseBtn')).toBeFocused();

  await page.keyboard.press('Tab');
  await expect(page.locator('#settingsBtn')).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('#languageSelect')).toBeFocused();
  await page.keyboard.press('ArrowDown');
  await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
  await page.keyboard.press('Escape');
  await expect(page.locator('#settingsBtn')).toBeFocused();

  await page.keyboard.press('Tab');
  const office = page.locator('#cameraButtons button[data-zone="office"]');
  const cafe = page.locator('#cameraButtons button[data-zone="cafe"]');
  await expect(office).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(cafe).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(cafe).toBeFocused();
  await expect(cafe).toHaveAttribute('aria-pressed', 'true');
  const announcement = page.locator('#operatorAnnouncement');
  await expect(announcement).toHaveAttribute('role', 'status');
  await expect(announcement).toHaveAttribute('aria-live', 'polite');
  await expect(announcement).toHaveAttribute('aria-atomic', 'true');
  await expect(announcement).toContainText('الكاميرا');
  await expect(announcement).toContainText('لم يتم اختيار شخص');

  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');
  const subjectPicker = page.locator('#subjectSelect');
  await expect(subjectPicker).toBeFocused();
  await expect(subjectPicker).toHaveAccessibleName('الأشخاص الظاهرون');
  await page.keyboard.press('ArrowDown');
  await expect(subjectPicker).toHaveValue('S-203');
  await expect(page.locator('#subjectName')).toHaveText('Aya');
  await expect(page.locator('#subjectId')).toHaveText('S-203');
  await expect(announcement).toContainText('تم اختيار Aya');
  await expect(announcement).toContainText('S-203');

  await page.keyboard.press('Tab');
  await expect(page.locator('#focusBtn')).toBeFocused();
  await page.keyboard.press('e');
  await expect(page.locator('#focusBtn')).toHaveAttribute('aria-pressed', 'true');
  await expect(announcement).toContainText('التركيز مفعّل');
  await page.screenshot({
    path: testInfo.outputPath(`${testInfo.project.name}-keyboard-subject-selection.png`),
    fullPage: true,
  });
});


test('320px Arabic operator keeps the frame and inspection controls reachable', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'narrow-760', '320px reflow acceptance');

  await page.setViewportSize({ width: 320, height: 720 });
  await page.goto('/');
  await page.locator('#menuSettingsBtn').click();
  await page.locator('#languageSelect').selectOption('ar');
  await page.locator('#closeSettingsBtn').click();
  await page.locator('#newGameBtn').click();
  await page.locator('#startShiftBtn').click();

  await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');

  const geometry = await page.evaluate(() => ({
    viewportWidth: document.documentElement.clientWidth,
    documentWidth: document.documentElement.scrollWidth,
  }));
  expect(geometry.documentWidth).toBeLessThanOrEqual(geometry.viewportWidth);

  const statusBar = page.locator('.statusbar');
  const statusBox = await statusBar.boundingBox();
  expect(statusBox).not.toBeNull();
  expect(statusBox.x).toBeGreaterThanOrEqual(0);
  expect(statusBox.x + statusBox.width).toBeLessThanOrEqual(geometry.viewportWidth);
  expect(statusBox.y).toBeGreaterThanOrEqual(0);
  expect(statusBox.y + statusBox.height).toBeLessThanOrEqual(720);

  const cafe = page.locator('#cameraButtons button[data-zone="cafe"]');
  await cafe.focus();
  await page.keyboard.press('Enter');
  await expect(cafe).toHaveAttribute('aria-pressed', 'true');
  const announcement = page.locator('#operatorAnnouncement');
  await expect(announcement).toContainText('الكاميرا');
  await expect(announcement).toContainText('لم يتم اختيار شخص');

  const subjectPicker = page.locator('#subjectSelect');
  await subjectPicker.focus();
  await page.keyboard.press('ArrowDown');
  await expect(subjectPicker).toHaveValue('S-203');
  await expect(page.locator('#subjectName')).toHaveText('Aya');
  await expect(announcement).toContainText('تم اختيار Aya');

  await page.locator('#focusBtn').focus();
  await page.keyboard.press('e');
  await expect(page.locator('#focusBtn')).toHaveAttribute('aria-pressed', 'true');
  await expect(announcement).toContainText('التركيز مفعّل');

  const panelBounds = await page.evaluate(() =>
    [...document.querySelectorAll('.topbar, .monitor-panel, .side-panel, .statusbar')]
      .filter((element) => element.getClientRects().length > 0)
      .map((element) => {
        const rect = element.getBoundingClientRect();
        return { left: rect.left, right: rect.right };
      })
  );
  expect(panelBounds.every((rect) => rect.left >= -1 && rect.right <= geometry.viewportWidth + 1)).toBe(true);

  await page.screenshot({ path: testInfo.outputPath('320-rtl-operator-frame.png') });
});

test('operator status live region announces selection and focus in English and Arabic', async ({ page }) => {
  await page.goto('/');
  await page.locator('#newGameBtn').click();
  await page.locator('#startShiftBtn').click();

  const announcement = page.locator('#operatorAnnouncement');
  await expect(announcement).toHaveAttribute('role', 'status');
  await expect(announcement).toHaveAttribute('aria-live', 'polite');
  await expect(announcement).toHaveAttribute('aria-atomic', 'true');

  await page.locator('#cameraButtons button[data-zone="cafe"]').click();
  await expect(announcement).toContainText('Camera CAFE. No subject selected.');
  await page.locator('#subjectSelect').selectOption('S-203');
  await expect(announcement).toContainText('Selected Aya, ID S-203.');
  await page.locator('#focusBtn').click();
  await expect(announcement).toContainText('Focused observation enabled.');

  await page.locator('#pauseBtn').click();
  await page.locator('#pauseSettingsBtn').click();
  await page.locator('#languageSelect').selectOption('ar');
  await page.locator('#closeSettingsBtn').click();
  await page.locator('#resumeBtn').click();
  await expect(announcement).toContainText('تم اختيار Aya');
  await expect(announcement).toContainText('التركيز متوقف');

  await page.locator('#focusBtn').click();
  await expect(announcement).toContainText('التركيز مفعّل');
});
