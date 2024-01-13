/* eslint-disable jest/no-conditional-expect */
import { test, expect } from '@playwright/test';
import { describe } from 'node:test';
import getPrice from './getPrice.js';
import 'dotenv/config';

describe('Basic Testing', () => {
  test('Homescreen loads', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    await page.getByRole('tab', { name: 'For you' }).isVisible();
    await page.getByRole('link', { name: 'Instacart' }).isVisible();
  });

  test('Aldi price check works', async ({ page }) => {
    const productURL = 'https://www.instacart.com/store/aldi/products/18647971';
    const price = await getPrice(productURL, page);
    await expect(price.length).toBeGreaterThan(2);
    await expect(price).toContain('.');
    console.log('Aldi: ' + price);
  });

  test('Shoprite price check works', async ({ page }) => {
    const productURL =
      'https://www.instacart.com/store/shoprite/products/20743127';
    const price = await getPrice(productURL, page);
    await expect(price.length).toBeGreaterThan(2);
    await expect(price).toContain('.');
    console.log('Shoprite: ' + price);
  });

  test('Costco price check works', async ({ page }) => {
    const productURL =
      'https://www.instacart.com/store/costco/products/19232612';
    const price = await getPrice(productURL, page);
    await expect(price.length).toBeGreaterThan(2);
    await expect(price).toContain('.');
    console.log('Costco: ' + price);
  });

  test('Big Y price check works', async ({ page }) => {
    const productURL =
      'https://www.instacart.com/store/big-y/products/17125754';
    const price = await getPrice(productURL, page);
    await expect(price.length).toBeGreaterThan(2);
    await expect(price).toContain('.');
    console.log('Big Y: ' + price);
  });
});
