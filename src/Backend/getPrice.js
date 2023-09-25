
import { chromium, devices } from 'playwright-extra';

const authFile = '../../playwright/.auth/user_backup.json'

async function getPrice(productURL) {
    // Setup
    const browser = await chromium.launch({headless: true});
    const context = await browser.newContext({ storageState: authFile });
    const page = await context.newPage();
    const priceFormat = /\d{1,3}(?:,\d{3})*(?:\.\d{2})?/

    // Scrape
    await page.goto(productURL);
    await page.waitForLoadState('domcontentloaded')
    const priceLabel = await page.locator('#item_details').locator('div[data-radium="true"]').locator('span').first().textContent();
    let price = priceLabel.split(" ")[0].match(priceFormat)[0];
    await browser.close();
    return price;
};
export default getPrice;