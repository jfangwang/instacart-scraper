import 'dotenv/config';
import { Client } from '@notionhq/client';
import getFoodList from "./getFoodList.js";
import getPrice from "./getPrice.js";

const notion = new Client({ auth: process.env.NOTION_API_KEY })

async function test() {
    const foodEntries = await getFoodList();
    console.log(foodEntries.results)

    // Parse through each food page/entry
    for (const i in foodEntries.results) {
        const foodEntry = foodEntries.results[i]
        const pageID = foodEntry.id;
        const propertiesObj = foodEntry.properties;
        const storeLinksArr = Object.keys(propertiesObj).filter((entry) => entry.includes('URL'))

        for (const storeIdx in storeLinksArr) {
            const store = storeLinksArr[storeIdx]
            const storeName = store.slice(0, store.length - 4)
            let storeUrlObj = propertiesObj[store]
            let newProperties;
            let payload = {};
            try {
                if (storeUrlObj.url.includes('http')) {
                    // Scrape prices on instacart
                    const priceLabel = await getPrice(storeUrlObj.url)
                    newProperties = {
                        [`${storeName + " Price"}`]: {
                            "number": Number(priceLabel)
                        },
                        "Updated": {
                            "date": {
                                start: new Date().toISOString(),
                                time_zone: Intl.DateTimeFormat().resolvedOptions().timeZone
                            },
                        }
                    };
                }
            } catch {
                console.log(`\n\nCould not get data on ${JSON.stringify(propertiesObj['Food Item'])} from ${storeName}, please revisited this.\n\n`);
                newProperties = {
                    "Updated": {
                        "date": {
                            start: new Date().toISOString(),
                            time_zone: Intl.DateTimeFormat().resolvedOptions().timeZone
                        },
                    }
                };
            }
            payload["page_id"] = pageID
            payload["properties"] = newProperties
            console.log(JSON.stringify(payload));
            await notion.pages.update(payload)
        }
    }
}
test()