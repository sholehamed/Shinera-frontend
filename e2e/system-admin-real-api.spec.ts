import { expect, test, type APIRequestContext, type Page } from '@playwright/test';

const api = 'http://127.0.0.1:5069/api/system';
const password = process.env.E2E_ADMIN_PASSWORD;
const captcha = 'ABCDE'; // Enabled only on disposable Development E2E fixture.

async function loginInBrowser(page: Page): Promise<string> {
  if (!password) throw new Error('E2E_ADMIN_PASSWORD is required.');
  await page.goto('/system/dashboard');
  await expect(page).toHaveURL(/\/system\/auth\/login/);
  await expect(page.locator('app-captcha img.captcha-image')).toBeVisible();
  await page.locator('input#username').fill('admin');
  await page.locator('input#password').fill(password);
  await page.locator('input#captcha-code').fill(captcha);
  await page.getByRole('button', { name: /ورود/ }).click();
  await expect(page).toHaveURL(/\/system\/dashboard/, { timeout: 20_000 });
  return await page.evaluate(() => localStorage.getItem('access_token') ?? '');
}

async function grant(request: APIRequestContext): Promise<string> {
  if (!password) throw new Error('E2E_ADMIN_PASSWORD is required.');
  const result = await request.get(api + '/Auth/captcha/new');
  expect(result.status()).toBe(200);
  const challenge = await result.json();
  const response = await request.post(api + '/Auth/login', {
    form: {
      grant_type: 'password', client_id: 'postman', username: 'admin',
      password, captchaid: challenge.token, userEnteredCaptchaCode: captcha,
      login_context: 'system', scope: 'openid profile email api offline_access'
    },
  });
  expect(response.status(), await response.text()).toBe(200);
  return (await response.json()).access_token as string;
}

test('System page guard refuses anonymous and tenant-context navigation', async ({ page }) => {
  await page.goto('/system/users');
  await expect(page).toHaveURL(/\/system\/auth\/login/);
  await page.evaluate(() => {
    localStorage.setItem('access_token', 'tenant-token-only');
    localStorage.setItem('account_type', 'tenant');
  });
  await page.goto('/system/roles');
  await expect(page).toHaveURL(/\/system\/auth\/login/);
});

test('real System browser login loads protected dashboard, role CRUD and tenant list', async ({ page, request }) => {
  const token = await loginInBrowser(page);
  expect(token).toBeTruthy();
  const headers = { Authorization: `Bearer ${token}` };

  // Verify dashboard is API-backed rather than a hard-coded Angular card.
  const dashboard = await request.get(api + '/Dashboard/super-dashboard', { headers });
  expect(dashboard.status(), await dashboard.text()).toBe(200);
  const stats = await dashboard.json();
  expect(stats.totalUsers).toBeGreaterThanOrEqual(1);

  await page.goto('/system/tenants');
  const tenants = await page.waitForResponse(resp =>
    resp.url().includes('/api/system/Tenants/pagedList') && resp.request().method() === 'POST'
  );
  expect(tenants.status()).toBe(200);

  await page.goto('/system/roles/create');
  const name = 'CI-SYSTEM-ROLE-' + Date.now();
  await page.getByRole('textbox', { name: 'نام نقش' }).fill(name);
  const createdPromise = page.waitForResponse(resp =>
    /\/api\/system\/Roles\/?$/i.test(resp.url()) && resp.request().method() === 'POST'
  );
  await page.getByRole('button', { name: 'ذخیره' }).click();
  const created = await createdPromise;
  expect(created.status(), await created.text()).toBe(201);
  const roleId = await created.json() as string;
  expect(roleId).toMatch(/^[0-9a-f-]{36}$/i);

  try {
    await expect(page).toHaveURL(/\/system\/roles$/);
    await page.goto(`/system/roles/${roleId}/edit`);
    await expect(page.getByRole('textbox', { name: 'نام نقش' })).toHaveValue(name);

    const changed = name + '-EDITED';
    await page.getByRole('textbox', { name: 'نام نقش' }).fill(changed);
    const updatedPromise = page.waitForResponse(resp =>
      resp.url().includes(`/api/system/Roles/${roleId}`) && resp.request().method() === 'PUT'
    );
    await page.getByRole('button', { name: 'ذخیره' }).click();
    expect((await updatedPromise).status()).toBe(204);

    const stored = await request.get(`${api}/Roles/${roleId}`, { headers });
    expect(stored.status(), await stored.text()).toBe(200);
    expect((await stored.json()).name).toBe(changed);
  } finally {
    const deleted = await request.delete(`${api}/Roles/${roleId}`, { headers });
    expect([200, 204]).toContain(deleted.status());
  }
});

test('real System menu category API supports create, update and delete, not dummy UI routes', async ({ request }) => {
  const token = await grant(request);
  const headers = { Authorization: `Bearer ${token}` };
  const title = 'CI menu category ' + Date.now();
  const created = await request.post(api + '/MenuCategories', {
    headers, data: { title, order: 3, isActive: true }
  });
  expect(created.status(), await created.text()).toBe(200);
  const categoryId = await created.json() as string;
  expect(categoryId).toMatch(/^[0-9a-f-]{36}$/i);

  try {
    const update = await request.put(api + '/MenuCategories', {
      headers, data: { id: categoryId, title: title + ' updated', order: 2, isActive: true }
    });
    expect(update.status(), await update.text()).toBe(204);

    const fetched = await request.get(api + '/MenuCategories/' + categoryId, { headers });
    expect(fetched.status(), await fetched.text()).toBe(200);
    expect((await fetched.json()).title).toBe(title + ' updated');
  } finally {
    const removed = await request.delete(api + '/MenuCategories/' + categoryId, { headers });
    expect([200, 204]).toContain(removed.status());
  }
});
