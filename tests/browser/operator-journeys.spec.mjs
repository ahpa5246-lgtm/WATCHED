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
