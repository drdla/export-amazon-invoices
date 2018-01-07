import chalk from 'chalk';
import commandLineArgs from 'command-line-args';
import fs from 'fs-extra';
import leftPad from 'left-pad';
import listOrdersOfYear from './lib/listOrdersOfYear';
import numberOfDigits from './lib/numberOfDigits';
import puppeteer from 'puppeteer';
import showUsageHints from './lib/showUsageHints';
import slugify from 'slugify';
import {log, logDetail, logError, logStatus} from './lib/log';

import argDefinitions from './lib/argDefinitions';
import selectors from './lib/selectors';
import {orderPageBase} from './lib/urls';

const args = commandLineArgs(argDefinitions);

if (!args.hasOwnProperty('email') || !args.hasOwnProperty('password')) {
  showUsageHints();
}

const resultsPerPage = 10;

// invoice links follow pattern 'Rechnung 1' or 'Rechnung oder Gutschrift 1'
const invoiceLinkRegex = /^Rechnung( oder Gutschrift)?s[0-9]{1,2}/;

const failedExports = [];

(async () => {
  // rimraf output dirs
  args.year.forEach(year => fs.remove(`./output/${year}`));

  // initialize browser
  const browser = await puppeteer.launch({
    headless: false,
  });
  const page = await browser.newPage();

  await page.setViewport({
    width: 1440,
    height: 900,
  });

  await page.goto(orderPageBase, {waitUntil: 'networkidle'});

  const requiresLogin = await page.evaluate(sel => document.querySelectorAll(sel).length > 0, selectors.login.form);
  if (requiresLogin) {
    logStatus(`Logging into Amazon account ${args.email}`);

    try {
      await page.click(selectors.login.email);
      await page.type(args.email);

      await page.click(selectors.login.password);
      await page.type(args.password);

      await page.click(selectors.login.submit);

      await page.waitForSelector(selectors.list.page);
    } catch (e) {
      logError(`Could not log in with\n  email     ${args.email}\n  password  ${args.password}`);
      process.exit();
    }
  }

  for (let ii = 0; ii < args.year.length; ii++) {
    let savedInvoices = 0;
    const year = args.year[ii];
    logStatus(`Exporting orders from ${year}`);

    fs.mkdirs(`./output/${year}`);

    await page.goto(listOrdersOfYear(year, 0), {waitUntil: 'networkidle'});

    const numberOfOrders = await page.$eval(selectors.list.numOrders, el => parseInt(el.innerText.split(' ')[0], 10));
    logStatus(`Starting export of ${numberOfOrders} orders`);

    for (let i = 1, l = numberOfOrders; i <= l; i++) {
      const resultsPage = Math.ceil(i / resultsPerPage);

      if (i % resultsPerPage === 1) {
        logStatus(`Loading results page ${resultsPage} of ${Math.ceil(numberOfOrders / 10)}`);

        await page.goto(listOrdersOfYear(year, resultsPage * resultsPerPage), {
          waitUntil: 'networkidle',
        });
        // Amazon initially renders just enough results (3) to populate the screen up to the page fold,
        // so to avoid null orders,
        // ~~we scroll down a bit to trigger rendering all results!?~~
        // ~~we wait for two seconds!?~~
        // await page.waitFor(2000);
      }

      const orderNumber = slugify(`${year} ${leftPad(i, numberOfDigits(numberOfOrders), '0')}`, '_');
      logDetail(`Exporting invoice(s) for order ${orderNumber}`);

      // TODO: find better selector?
      // there is a hidden alert component at the top of the orders list, so we always have to increase the index by 1
      const orderIndex = i % resultsPerPage === 0 ? resultsPerPage + 1 : i % resultsPerPage + 1;

      try {
        const el = await page.$(`${selectors.list.order}:nth-child(${orderIndex}) ${selectors.list.popoverTrigger}`);
        await el.click();

        // TODO: wait until spinner in popover has been replaced by content
        // const popover = await page.$('.a-popover', {visible: true});

        // log('popover', popover.getAttribute(className), popover);

        // const popoverLinks = await page.$$eval(selectors.list.popoverContent, el => {
        //   log('popoverLinks', el.innerText, el.innerText.match(invoiceLinkRegex));
        // });

        // save invoice(s) into target folder
        // increase savedInvoices count accordingly

        // TEMP: take a screenshot instead of downloading invoice
        // until finding the download links and triggering the download works
        await page.waitFor(100); // give the popover time to render / fade in
        await page.screenshot({
          fullPage: true,
          path: `./output/${year}/${orderNumber}.png`,
        });
      } catch (e) {
        failedExports.push(`${orderNumber} (page ${resultsPage}, orderIndex ${orderIndex})`);
        logError(`Did not find popoverTrigger for orderIndex ${orderIndex} (order ${orderNumber})`);
        logDetail(e);
        logDetail(`Selector: ${selectors.list.order}:nth-child(${orderIndex}) ${selectors.list.popoverTrigger}`);
        await page.screenshot({
          fullPage: true,
          path: `./output/${year}/FAILED__${orderNumber}.png`,
        });
      }
    }

    logStatus(`${savedInvoices} invoices saved as PDF in folder /output/${year}`);
  }

  await browser.close();
  logStatus('Export complete');
  console.log(
    ' ',
    chalk.dim('Type'),
    args.year.length === 1 ? `open ./output/${args.year[0]}` : 'open ./output',
    chalk.dim('to view the files')
  );
  if (failedExports.length) {
    logError(`${failedExports.length} failed export${failedExports.length === 1 ? '' : 's'}:`);
    logDetail(failedExports.join('\n  '));
  }
})();
