import { expect, test } from '@playwright/test';

test('Arabic operator can complete inspection, pause, and settings at a 200%-equivalent viewport', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'zoom-200-equivalent', '200%-equivalent viewport acceptance');

  await page.goto('/');
  await page.locator('#menuSettingsBtn').click();
  await page.locator('#languageSelect').selectOption('ar');
  await page.locator('#closeSettingsBtn').click();
  await page.locator('#newGameBtn').click();
  await page.locator('#startShiftBtn').click();

  await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');

  const initialGeometry = await page.evaluate(() => {
    const status = document.querySelector('.statusbar').getBoundingClientRect();
    const appShell = document.querySelector('.app-shell');
    return {
      devicePixelRatio: window.devicePixelRatio,
      viewportWidth: document.documentElement.clientWidth,
      viewportHeight: document.documentElement.clientHeight,
      documentWidth: document.documentElement.scrollWidth,
      windowScrollY: window.scrollY,
      appShell: {
        height: appShell.getBoundingClientRect().height,
        overflow: getComputedStyle(appShell).overflow,
      },
      status: { left: status.left, right: status.right, top: status.top, bottom: status.bottom },
    };
  });

  expect(initialGeometry.devicePixelRatio).toBe(2);
  expect(initialGeometry.viewportWidth).toBe(640);
  expect(initialGeometry.viewportHeight).toBe(450);
  expect(initialGeometry.documentWidth).toBeLessThanOrEqual(initialGeometry.viewportWidth);
  expect(initialGeometry.windowScrollY).toBe(0);
  expect(initialGeometry.appShell.height).toBe(450);
  expect(initialGeometry.appShell.overflow).toBe('hidden');
  expect(initialGeometry.status.left).toBeGreaterThanOrEqual(-1);
  expect(initialGeometry.status.right).toBeLessThanOrEqual(initialGeometry.viewportWidth + 1);
  expect(initialGeometry.status.top).toBeGreaterThanOrEqual(0);
  expect(initialGeometry.status.bottom).toBeLessThanOrEqual(initialGeometry.viewportHeight);

  const visiblePanels = await page.evaluate(() =>
    [...document.querySelectorAll('.topbar, .monitor-panel, .side-panel, .statusbar')]
      .filter((element) => element.getClientRects().length > 0)
      .map((element) => {
        const rect = element.getBoundingClientRect();
        return { left: rect.left, right: rect.right };
      })
  );
  expect(visiblePanels.length).toBeGreaterThanOrEqual(4);
  expect(visiblePanels.every((rect) => rect.left >= -1 && rect.right <= 641)).toBe(true);

  const consoleGrid = page.locator('.console-grid');
  const consoleGeometry = await consoleGrid.evaluate((element) => ({
    clientHeight: element.clientHeight,
    scrollHeight: element.scrollHeight,
  }));
  expect(consoleGeometry.scrollHeight).toBeGreaterThan(consoleGeometry.clientHeight);

  const cafe = page.locator('#cameraButtons button[data-zone="cafe"]');
  await cafe.focus();
  await expect(cafe).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(cafe).toHaveAttribute('aria-pressed', 'true');

  const announcement = page.locator('#operatorAnnouncement');
  await expect(announcement).toContainText('الكاميرا');
  await expect(announcement).toContainText('لم يتم اختيار شخص');

  const subjectPicker = page.locator('#subjectSelect');
  await subjectPicker.focus();
  await expect(subjectPicker).toBeFocused();
  await page.keyboard.press('ArrowDown');
  await expect(subjectPicker).toHaveValue('S-203');
  await expect(subjectPicker).toHaveAccessibleName('الأشخاص الظاهرون');
  await expect(page.locator('#subjectName')).toHaveText('Aya');
  await expect(announcement).toContainText('تم اختيار Aya');

  const focusButton = page.locator('#focusBtn');
  await focusButton.focus();
  await expect(focusButton).toBeFocused();
  await page.keyboard.press('e');
  await expect(focusButton).toHaveAttribute('aria-pressed', 'true');
  await expect(announcement).toContainText('التركيز مفعّل');
  await expect(focusButton).toBeInViewport();

  await page.screenshot({ path: testInfo.outputPath('zoom-200-arabic-inspection.png'), fullPage: true });

  await consoleGrid.evaluate((element) => {
    element.scrollTop = element.scrollHeight;
  });
  await expect(page.locator('.event-log')).toBeInViewport();
  await expect(page.locator('.statusbar')).toBeInViewport();

  await page.keyboard.press('Escape');
  const pause = page.locator('#pauseOverlay');
  await expect(pause).toBeVisible();
  await expect(page.locator('#resumeBtn')).toBeFocused();

  await page.locator('#pauseSettingsBtn').focus();
  await page.keyboard.press('Enter');
  const settings = page.locator('#settingsOverlay');
  await expect(settings).toBeVisible();

  const settingsModal = settings.locator('.modal');
  const settingsBounds = await settingsModal.boundingBox();
  expect(settingsBounds).not.toBeNull();
  expect(settingsBounds.x).toBeGreaterThanOrEqual(0);
  expect(settingsBounds.x + settingsBounds.width).toBeLessThanOrEqual(640);
  expect(settingsBounds.y).toBeGreaterThanOrEqual(0);
  expect(settingsBounds.y + settingsBounds.height).toBeLessThanOrEqual(450);

  await expect(page.locator('#languageSelect')).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(page.locator('#volumeRange')).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(page.locator('#scanlinesToggle')).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(page.locator('#motionToggle')).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(page.locator('#closeSettingsBtn')).toBeFocused();
  await expect(page.locator('#closeSettingsBtn')).toBeInViewport();
  await page.keyboard.press('Enter');

  await expect(settings).toBeHidden();
  await expect(pause).toBeVisible();
  await expect(page.locator('#pauseSettingsBtn')).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(pause).toBeHidden();
  await expect(page.locator('#gameCanvas')).toBeVisible();
  await expect(page.locator('#pauseBtn')).toBeHidden();
  await page.screenshot({ path: testInfo.outputPath('zoom-200-arabic-resumed.png'), fullPage: true });
});
