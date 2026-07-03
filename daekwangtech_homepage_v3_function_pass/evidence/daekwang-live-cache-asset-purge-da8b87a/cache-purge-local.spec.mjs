import { test, expect } from '@playwright/test';
import fs from 'node:fs/promises';

const base = 'http://127.0.0.1:4187';
const evidenceDir = 'evidence/daekwang-live-cache-asset-purge-da8b87a';

test('local cache purge deletes old Daekwang caches and keeps mobile UI usable', async ({ page }) => {
  const consoleErrors = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });
  page.on('pageerror', (error) => consoleErrors.push(error.message));

  await page.goto(`${base}/daekwang-sw.js`, { waitUntil: 'networkidle' });
  await page.evaluate(async () => {
    await caches.open('daekwang-app-shell-v1');
    await caches.open('daekwang-runtime-v1');
    await caches.open('other-cache-keep');
  });
  const beforeKeys = await page.evaluate(() => caches.keys());

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${base}/?v=local-cache-purge-da8b87a#/`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1200);
  const afterKeys = await page.evaluate(() => caches.keys());
  const registrations = await page.evaluate(async () => {
    if (!('serviceWorker' in navigator)) return [];
    return (await navigator.serviceWorker.getRegistrations()).map((registration) => registration.scope);
  });
  const loadedScripts = await page.evaluate(() => performance.getEntriesByType('resource').filter((entry) => entry.initiatorType === 'script').map((entry) => entry.name));
  const heroText = await page.locator('h1').first().innerText();
  await page.screenshot({ path: `${evidenceDir}/live-home-390-after-cache-purge.png`, fullPage: true });

  await page.goto(`${base}/?v=local-cache-purge-da8b87a#/products`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(700);
  await page.screenshot({ path: `${evidenceDir}/live-products-390-after-cache-purge.png`, fullPage: true });
  const productsText = await page.locator('body').innerText();

  await page.goto(`${base}/?v=local-cache-purge-da8b87a#/admin`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(700);
  await page.screenshot({ path: `${evidenceDir}/live-admin-login-after-cache-purge.png`, fullPage: true });
  const adminText = await page.locator('body').innerText();

  const result = {
    base,
    beforeKeys,
    afterKeys,
    oldCachesRemoved: !afterKeys.includes('daekwang-app-shell-v1') && !afterKeys.includes('daekwang-runtime-v1'),
    unrelatedCachePreserved: afterKeys.includes('other-cache-keep'),
    registrations,
    serviceWorkersUnregistered: registrations.length === 0,
    loadedScripts,
    heroText,
    productsVisible: productsText.includes('유압 피팅') || productsText.includes('제품'),
    adminLoginVisible: adminText.includes('관리자') || adminText.includes('로그인'),
    consoleErrors,
  };
  await fs.writeFile(`${evidenceDir}/cache-delete-proof.json`, JSON.stringify(result, null, 2));
  await fs.writeFile(`${evidenceDir}/console-errors-after.json`, JSON.stringify(consoleErrors, null, 2));

  expect(result.oldCachesRemoved).toBeTruthy();
  expect(result.serviceWorkersUnregistered).toBeTruthy();
  expect(result.productsVisible).toBeTruthy();
  expect(result.adminLoginVisible).toBeTruthy();
});
