import puppeteer from 'puppeteer-core';
import path from 'path';
import { fileURLToPath } from 'url';
import http from 'http';
import app from './server.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function capture() {
  // Start server on local port
  const server = http.createServer(app);
  await new Promise((resolve) => server.listen(3456, resolve));
  const url = 'http://localhost:3456';
  console.log('Test server running at:', url);

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900, deviceScaleFactor: 2 });

  console.log('Navigating to:', url);
  await page.goto(url, { waitUntil: 'networkidle0' });

  // Figure 1: Landing Page
  const fig1Path = path.join(__dirname, 'fig1_landing.png');
  await page.screenshot({ path: fig1Path });
  console.log('Saved:', fig1Path);

  // Figure 2: Validation Errors (Click "Test Server Errors" button and submit)
  await page.evaluate(() => {
    document.getElementById('btnFillInvalid').click();
    document.getElementById('btnSubmit').click();
  });
  await new Promise((r) => setTimeout(r, 600));

  const fig2Path = path.join(__dirname, 'fig2_validation_errors.png');
  await page.screenshot({ path: fig2Path });
  console.log('Saved:', fig2Path);

  // Figure 3: Valid Submission (Click "Fill Valid Candidate" and submit)
  await page.evaluate(() => {
    document.getElementById('btnFillValid').click();
    document.getElementById('btnSubmit').click();
  });
  await new Promise((r) => setTimeout(r, 800));

  const fig3Path = path.join(__dirname, 'fig3_success_pass.png');
  await page.screenshot({ path: fig3Path });
  console.log('Saved:', fig3Path);

  // Figure 4: Candidate Directory (Switch to tab 2)
  await page.evaluate(() => {
    const tabBtn = document.querySelector('[data-tab="tab-records"]');
    if (tabBtn) tabBtn.click();
  });
  await new Promise((r) => setTimeout(r, 600));

  const fig4Path = path.join(__dirname, 'fig4_attendees_list.png');
  await page.screenshot({ path: fig4Path });
  console.log('Saved:', fig4Path);

  // Figure 5: JSON Payload Inspector (Switch to tab 4)
  await page.evaluate(() => {
    const tabBtn = document.querySelector('[data-tab="tab-json"]');
    if (tabBtn) tabBtn.click();
  });
  await new Promise((r) => setTimeout(r, 600));

  const fig5Path = path.join(__dirname, 'fig5_validation_guide.png');
  await page.screenshot({ path: fig5Path });
  console.log('Saved:', fig5Path);

  await browser.close();
  server.close();
  console.log('All screenshots captured successfully!');
}

capture().catch((err) => {
  console.error('Screenshot capture failed:', err);
  process.exit(1);
});
