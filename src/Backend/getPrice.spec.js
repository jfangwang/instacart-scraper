/* eslint-disable jest/no-conditional-expect */
import { test, expect } from '@playwright/test';
import { describe } from 'node:test';
import { Client } from '@notionhq/client';
import getFoodList from './getFoodList.js';
import getPrice from './getPrice.js';
import 'dotenv/config';

const notion = new Client({ auth: process.env.NOTION_API_KEY });

describe('Basic Testing', () => {
  test('Homescreen loads', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    await page.getByRole('tab', { name: 'For you' }).isVisible();
    await page.getByRole('link', { name: 'Instacart' }).isVisible();
  });

  test('Homescreen loads 1', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    await page.getByRole('tab', { name: 'For you' }).isVisible();
    // await page.getByRole('link', { name: 'Instacart' }).isVisible();
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

describe('Main Function Test', () => {
  test('Main Function', async ({ page }) => {
    const foodEntries = await getFoodList();
    // Parse through each food page/entry
    for (const i in foodEntries.results) {
      const foodEntry = foodEntries.results[i];
      const pageID = foodEntry.id;
      const propertiesObj = foodEntry.properties;
      const storeLinksArr = Object.keys(propertiesObj).filter((entry) =>
        entry.includes('URL'),
      );
      for (const storeIdx in storeLinksArr) {
        const store = storeLinksArr[storeIdx];
        const storeName = store.slice(0, store.length - 4);
        let storeUrlObj = propertiesObj[store];
        let newProperties;
        try {
          if (typeof storeUrlObj.url === 'string') {
            const priceLabel = await getPrice(storeUrlObj.url, page);
            await expect(priceLabel.length).toBeGreaterThan(2);
            await expect(priceLabel).toContain('.');
            newProperties = {
              [`${storeName + ' Price'}`]: {
                number: Number(priceLabel) === 0 ? null : Number(priceLabel),
              },
              Updated: {
                date: {
                  start: new Date().toISOString(),
                },
              },
            };
            let payload = {};
            payload['page_id'] = pageID;
            payload['properties'] = newProperties;
            console.log(
              `${storeName}: ${newProperties[storeName + ' Price'].number}`,
            );
            await notion.pages.update(payload);
          }
        } catch (err) {
          // eslint-disable-next-line jest/no-conditional-expect
          console.log(err);
          await expect(true).toBe(false);
        }
      }
    }
  });
});
