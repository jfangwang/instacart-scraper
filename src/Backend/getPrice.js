async function getPrice(productURL, page) {
  const priceFormat = /\d{1,3}(?:,\d{3})*(?:\.\d{2})?/;

  // Scrape
  try {
    if (typeof productURL === 'string' || productURL instanceof String) {
      await page.goto(productURL);
      await page.waitForLoadState('domcontentloaded');
      const label = await page
        .locator('#item_details')
        .locator('div[data-radium="true"]')
        .locator('span')
        .first()
        .textContent();
      if (label.includes('$')) {
        const priceLabels = await page
          .locator('#item_details')
          .locator('div[data-radium="true"]')
          .filter({ hasText: '$' })
          .textContent();
        const price = priceLabels.split(' ')[0].match(priceFormat)[0];
        return price;
      }
    } else {
      return null;
    }
  } catch (err) {
    console.log(err);
    return null;
  }
  return null;
}
export default getPrice;
