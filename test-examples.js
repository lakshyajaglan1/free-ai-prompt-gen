const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1280, height: 1024 });

  const consoleMessages = [];
  page.on('console', msg => consoleMessages.push(`${msg.type()}: ${msg.text()}`));
  page.on('pageerror', err => consoleMessages.push(`ERROR: ${err.message}`));

  await page.goto('http://localhost:4321/examples');
  await page.waitForTimeout(3000);

  // Check how many example cards are in the DOM
  const cardCount = await page.locator('.example-card').count();
  const containerHTML = await page.locator('#examples-container').innerHTML();
  const hasContent = containerHTML.length > 100;

  console.log(`Example cards in DOM: ${cardCount}`);
  console.log(`Container has content: ${hasContent}`);
  console.log(`Container length: ${containerHTML.length}`);
  console.log('\nConsole messages:');
  consoleMessages.forEach(msg => console.log('  ' + msg));

  await page.screenshot({ path: '/tmp/examples-test.png', fullPage: true });
  console.log('\nScreenshot saved');

  await browser.close();
})();
