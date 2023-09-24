import { test as expect, test } from '@playwright/test';

const priceFormat = /\d{1,3}(?:,\d{3})*(?:\.\d{2})?/

test('Homescreen loads', async ({ page }) => {
  await page.goto("/");
  await page.waitForLoadState('domcontentloaded')
  await page.getByRole('tab', { name: 'For you' }).isVisible();
  await page.getByRole('link', { name: 'Instacart' }).isVisible();
});

test('Homescreen loads 1', async ({ page }) => {
  await page.goto("/");
  await page.waitForLoadState('domcontentloaded')
  await page.getByRole('tab', { name: 'For you' }).isVisible();
  // await page.getByRole('link', { name: 'Instacart' }).isVisible();
});

test('Aldi price check works', async ({ page }) => {
  const productURL = 'https://www.instacart.com/store/aldi/products/16902710'
  await page.goto(productURL);
  await page.waitForLoadState('domcontentloaded')
  const priceLabel = await page.locator('#item_details').locator('div[data-radium="true"]').locator('span').first().textContent();
  let price = priceLabel.split(" ")[0].match(priceFormat)[0];
  await expect(price.length).toBeGreaterThan(2);
  await expect(price).toContain('.');
  console.log("Aldi: " + price)
});

test('Shoprite price check works', async ({ page }) => {
  const productURL = 'https://www.instacart.com/store/shoprite/products/20743038'
  await page.goto(productURL);
  await page.waitForLoadState('domcontentloaded')
  const priceLabel = await page.locator('#item_details').locator('div[data-radium="true"]').locator('span').first().textContent();
  let price = priceLabel.split(" ")[0].match(priceFormat)[0];
  await expect(price.length).toBeGreaterThan(2);
  await expect(price).toContain('.');
  console.log("Shoprite: " + price)
});

test('Costco price check works', async ({ page }) => {
  const productURL = 'https://www.instacart.com/store/costco/products/99392'
  await page.goto(productURL);
  await page.waitForLoadState('domcontentloaded')
  const priceLabel = await page.locator('#item_details').locator('div[data-radium="true"]').locator('span').first().textContent();
  let price = priceLabel.split(" ")[0].match(priceFormat)[0];
  await expect(price.length).toBeGreaterThan(2);
  await expect(price).toContain('.');
  console.log("Costco: " + price)
});

test('Big Y price check works', async ({ page }) => {
  const productURL = 'https://www.instacart.com/store/big-y/products/17125684'
  await page.goto(productURL);
  await page.waitForLoadState('domcontentloaded')
  const priceLabel = await page.locator('#item_details').locator('div[data-radium="true"]').locator('span').first().textContent();
  let price = priceLabel.split(" ")[0].match(priceFormat)[0];
  await expect(price.length).toBeGreaterThan(2);
  await expect(price).toContain('.');
  console.log("Big Y: " + price)
});