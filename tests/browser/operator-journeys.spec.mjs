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
