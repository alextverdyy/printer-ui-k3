import { expect, test } from '@playwright/test';

// Isolate every browser from real printers, including websocket reconnects.
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('moonraker-base-url', 'http://127.0.0.1:4410');
    localStorage.setItem('moonraker-websocket-url', 'ws://127.0.0.1:4410/websocket');
  });
  await page.routeWebSocket('**/*', (socket) => socket.close());
  await page.route('**/*', (route) => {
    const url = new URL(route.request().url());
    if (url.host !== '127.0.0.1:4410') return route.abort();
    if (/^\/(printer|server|machine)\//.test(url.pathname)) {
      return route.fulfill({ status: route.request().method() === 'GET' ? 503 : 200,
        contentType: 'application/json', body: '{"result":"offline test fixture"}' });
    }
    return route.continue();
  });
});

test('reference navigation and safe emergency confirmation', async ({ page }) => {
  const commands: string[] = [];
  page.on('request', (request) => { if (request.method() === 'POST') commands.push(request.url()); });
  await page.goto('/');
  await expect(page.getByRole('link', { name: 'Print', exact: true }).first()).toBeVisible();
  await page.getByRole('link', { name: 'Control', exact: true }).click();
  await expect(page.getByText('Fan Speeds', { exact: true })).toBeAttached();
  await page.getByRole('button', { name: 'Emergency', exact: true }).click();
  const cancel = page.getByRole('button', { name: 'Cancel', exact: true });
  await expect(cancel).toBeFocused();
  await cancel.click();
  expect(commands).toEqual([]);
  await page.getByRole('button', { name: 'Emergency', exact: true }).click();
  await page.getByRole('button', { name: 'Emergency Stop', exact: true }).click();
  await expect.poll(() => commands.filter((url) => url.endsWith('/printer/emergency_stop')).length).toBe(1);
});

test('jog keyboard activation and scrollable controls never overlap the dock', async ({ page }) => {
  const commands: string[] = [];
  page.on('request', (request) => { if (request.url().endsWith('/printer/gcode/script')) commands.push(request.postData() || ''); });
  await page.goto('/control');
  await page.getByRole('button', { name: 'Y+', exact: true }).press('Enter');
  await expect.poll(() => commands.length).toBe(1);
  expect(JSON.parse(commands[0]).script).toContain('G1 Y10.00');
  await page.getByText('No macros discovered.').scrollIntoViewIfNeeded();
  const content = await page.locator('.screen-content').boundingBox();
  const dock = await page.getByRole('navigation').boundingBox();
  expect(content!.y + content!.height).toBeLessThanOrEqual(dock!.y);
  expect(await page.locator('.screen-content').evaluate((el) => el.scrollWidth <= el.clientWidth)).toBe(true);
  await expect(page.getByRole('button', { name: 'Emergency', exact: true })).toBeVisible();
});

test('appearance persists, exports only allowed fields, and rejects printer settings', async ({ page }) => {
  await page.goto('/settings');
  await page.getByRole('button', { name: '120%', exact: true }).click();
  await page.locator('#accent-color').fill('#ffee00');
  await page.reload();
  await expect(page.getByRole('button', { name: '120%', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('#accent-color')).toHaveValue('#ffee00');
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export appearance', exact: true }).click();
  const download = await downloadPromise;
  const stream = await download.createReadStream();
  let raw = ''; for await (const chunk of stream!) raw += chunk;
  expect(JSON.parse(raw)).toEqual({ version: 1, accent: '#ffee00', textScale: 1.2 });
  await page.locator('input[type=file]').setInputFiles({ name: 'printer-settings.json', mimeType: 'application/json',
    buffer: Buffer.from(JSON.stringify({ version: 1, accent: null, textScale: 1, moonraker_api_key: 'fixture-only' })) });
  await expect(page.getByRole('status')).toContainText('not a supported');
  await expect(page.locator('#accent-color')).toHaveValue('#ffee00');
  await page.locator('input[type=file]').setInputFiles({ name: 'appearance.json', mimeType: 'application/json',
    buffer: Buffer.from(JSON.stringify({ version: 1, accent: '#345678', textScale: 1.1 })) });
  await expect(page.getByRole('button', { name: '110%', exact: true })).toHaveAttribute('aria-pressed', 'true');
});
