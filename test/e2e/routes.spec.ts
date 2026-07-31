import { expect, test } from '@playwright/test';

const routes = [
  '/',
  '/about',
  '/writing',
  '/writing/ai-search-trust',
  '/writing/service-drive-acquisition',
  '/writing/look-to-book',
  '/writing/digital-trust-audit',
  '/writing/paperless-lessons',
  '/writing/dealer-ai-schema',
  '/newsletter',
  '/podcast',
  '/contact',
  '/playbook',
  '/playlist',
  '/changelog',
];

const publicStatusLanguage =
  /\b(pending|provisional|placeholder|TBD)\b|not asserted|source validation|ledger confirmation/i;

for (const route of routes) {
  test(`${route} loads without console errors`, async ({ page }) => {
    const consoleErrors: string[] = [];
    const pageErrors: string[] = [];

    await page.route('**/_vercel/**', async (route) => {
      await route.fulfill({ status: 204, contentType: 'application/javascript', body: '' });
    });

    page.on('console', (message) => {
      if (message.type() === 'error') {
        consoleErrors.push(message.text());
      }
    });
    page.on('pageerror', (error) => {
      pageErrors.push(error.message);
    });

    const response = await page.goto(route, { waitUntil: 'domcontentloaded' });

    expect(response?.status(), `${route} status`).toBeLessThan(400);
    expect(consoleErrors, `${route} console errors`).toEqual([]);
    expect(pageErrors, `${route} page errors`).toEqual([]);
  });

  test(`${route} does not expose internal status language`, async ({ page }) => {
    await page.route('**/_vercel/**', async (route) => {
      await route.fulfill({ status: 204, contentType: 'application/javascript', body: '' });
    });

    await page.goto(route, { waitUntil: 'domcontentloaded' });

    const publicText = await page.locator('body').innerText();
    const metaDescriptions = await page
      .locator('meta[name="description"], meta[property="og:description"], meta[name="twitter:description"]')
      .evaluateAll((nodes) => nodes.map((node) => node.getAttribute('content') ?? '').join('\n'));

    expect(publicText, `${route} body text`).not.toMatch(publicStatusLanguage);
    expect(metaDescriptions, `${route} meta descriptions`).not.toMatch(publicStatusLanguage);
  });
}
