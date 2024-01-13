import 'dotenv/config';
import { Client } from '@notionhq/client';
import getFoodList from './getFoodList.js';
import getPrice from './getPrice.js';
import { chromium } from 'playwright-extra';

const notion = new Client({ auth: process.env.NOTION_API_KEY });

async function test() {
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
        // Setup
        const browser = await chromium.launch({ headless: true });
        const context = await browser.newContext();
        const page = await context.newPage();
        // Scrape prices on instacart
        const priceLabel = await getPrice(storeUrlObj.url, page);
        await browser.close();
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
      } catch (err) {
        console.log(
          `\n\nCould not get data on ${JSON.stringify(storeUrlObj.url)} from ${storeName}.\nError: ${err}\n\n`,
        );
        newProperties = {
          [`${storeName + ' Price'}`]: {
            number: null,
          },
          Updated: {
            date: {
              start: new Date().toISOString(),
            },
          },
        };
      }
      let payload = {};
      payload['page_id'] = pageID;
      payload['properties'] = newProperties;
      console.log(
        `${storeName}: ${newProperties[storeName + ' Price'].number}`,
      );
      await notion.pages.update(payload);
    }
  }
  return;
}
test();
