import { test as setup } from '@playwright/test';
import { chromium } from 'playwright-extra';
import pluginStealth from 'puppeteer-extra-plugin-stealth';
import 'dotenv/config';

const authFile = 'playwright/.auth/user.json';
chromium.use(pluginStealth);

setup('Instacart authentication', async ({ page }) => {
  await page.goto('https://www.instacart.com/login');
  await page.getByPlaceholder('Email').click();
  await page.getByPlaceholder('Email').fill(process.env.INSTACART_USERNAME);
  await page.getByPlaceholder('Password').click();
  await page.getByPlaceholder('Password').fill(process.env.INSTACART_PASSWORD);
  await page.getByRole('button', { name: 'Log in' }).click();
  await page.waitForURL(
    'https://www.instacart.com/store/?categoryFilter=homeTabForYou',
  );
  await page.context().storageState({ path: authFile });
});
