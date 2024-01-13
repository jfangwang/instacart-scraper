import 'dotenv/config';
import { Client } from '@notionhq/client';
import getFoodList from './getFoodList.js';
import getPrice from './getPrice.js';
import { chromium } from 'playwright-extra';

const notion = new Client({ auth: process.env.NOTION_API_KEY });

async function test() {
  const foodEntries = await getFoodList();

  // Browser Setup
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

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
      const storeName = store.split(' ').slice(0, -1).join(' ');
      const storeUrlObj = propertiesObj[store];
      let newProperties;
      try {
        // Scrape prices on instacart
        const priceLabel = await getPrice(storeUrlObj.url, page);
        newProperties = {
          [`${storeName + ' Price'}`]: {
            number: priceLabel === null ? null : Number(priceLabel),
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
      console.log(
        `${storeName}: ${newProperties[storeName + ' Price'].number}`,
      );
      await notion.pages.update({
        page_id: pageID,
        properties: newProperties,
      });
    }
  }
  await browser.close();
  return 'Updated';
}
test();
