
import { chromium, devices } from 'playwright-extra';

const authFile = '../../playwright/.auth/user_backup.json'

async function getPrice(productURL) {
    // Setup
    const browser = await chromium.launch({headless: true});
    const context = await browser.newContext({ storageState: authFile });
    const page = await context.newPage();
    const priceFormat = /\d{1,3}(?:,\d{3})*(?:\.\d{2})?/

    // Auth
    // await page.goto('https://www.instacart.com/login');
    // await page.getByPlaceholder('Email').click();
    // await page.getByPlaceholder('Email').fill('jfwangtravelers@gmail.com');
    // await page.getByPlaceholder('Password').click();
    // await page.getByPlaceholder('Password').fill('jp7vKtuKi4Ezueh');
    // await page.getByRole('button', { name: 'Log in' }).click();
    // await page.waitForURL('https://www.instacart.com/store/?categoryFilter=homeTabForYou');

    // Scrape
    await page.goto(productURL);
    await page.waitForLoadState('domcontentloaded')
    const priceLabel = await page.locator('#item_details').locator('div[data-radium="true"]').locator('span').first().textContent();
    let price = priceLabel.split(" ")[0].match(priceFormat)[0];
    await browser.close();
    return price;
};
export default getPrice;