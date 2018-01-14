import commandLineArgs from 'command-line-args';
import credentialsAreMissing from './lib/credentialsAreMissing';
import fs from 'fs-extra';
import getOrderDetails from './lib/getOrderDetails';
import getOrderNumber from './lib/getOrderNumber';
import listOrders from './lib/listOrders';
import loadNextPageIfRequired from './lib/loadNextPageIfRequired';
import logInIfRequired from './lib/logInIfRequired';
import logResults from './lib/logResults';
import orderDataToCSV from './lib/orderDataToCSV';
import puppeteer from 'puppeteer';
import rimrafOutputFolders from './lib/rimrafOutputFolders';
import showUsageHints from './lib/showUsageHints';
import {ab2str, str2ab} from './lib/convertBetweenStringAndArrayBuffer.js';
import {log, logDetail, logError, logStatus} from './lib/log';

import argDefinitions from './lib/argDefinitions';
import selectors from './lib/selectors';
import {resultsPerPage} from './lib/constants';

const args = commandLineArgs(argDefinitions);

if (credentialsAreMissing(args)) {
  showUsageHints();
}

const orderData = [];
const failedExports = [];

(async () => {
  rimrafOutputFolders(args);

  // initialize browser
  const browser = await puppeteer.launch({
    devtools: false, // have DevTools open for debugging (sets 'headless' option to false, when true)
    headless: false, // FIXME: puppeteer should really run in headless mode, but when it's doing, it can't even log in
    args: [
      '--disable-web-security', // disable CORS to allow PDF download
    ],
  });
  const page = await browser.newPage();

  // enable download of PDF files, see https://github.com/GoogleChrome/puppeteer/issues/610#issuecomment-340160025
  // make function writeABString available on the window object
  await page.exposeFunction('writeABString', async (strbuf, targetFile) => {
    return new Promise((resolve, reject) => {
      // convert the ArrayBuffer string back to an ArrayBufffer,
      // which in turn is converted to a Buffer
      const b = Buffer.from(str2ab(strbuf));

      // try saving the file
      fs.writeFile(targetFile, b, (err, text) => (err ? reject(err) : resolve(targetFile)));
    });
  });

  // pipe log output from browser to console
  // page.on('console', msg => log( ...msg.args));

  await page.setViewport({
    width: 1440,
    height: 900,
  });

  await page.goto(listOrders(), {waitUntil: 'load'});

  await logInIfRequired(page, args);

  for (let ii = 0; ii < args.year.length; ii++) {
    const year = args.year[ii];
    log();
    logStatus(`Exporting orders of ${year}`);

    const outputFolder = `./output/${year}`;
    fs.mkdirs(outputFolder);

    await page.goto(listOrders(year, 0), {waitUntil: 'load'});

    const numberOfOrders = Math.min(
      args.limit,
      await page.$eval(selectors.list.numOrders, el => parseInt(el.innerText.split(' ')[0], 10))
    );
    logDetail(`Starting export of ${numberOfOrders} orders`);

    // define variables that should be available in page.evaluate
    const context = {
      outputFolder,
    };

    for (let i = 1, l = numberOfOrders; i <= l; i++) {
      await loadNextPageIfRequired(page, i, numberOfOrders, year);

      const orderNumber = getOrderNumber(i.toString(), year, numberOfOrders);
      logDetail(`Trying to export invoice(s) for order ${orderNumber}`);

      // there is a hidden alert component at the top of the orders list,
      // so a selector using nth-child within the ordersContainer has to start at 2,
      // meaning we have to increase all orderIndex values by 1
      const orderIndex = i % resultsPerPage === 0 ? resultsPerPage + 1 : i % resultsPerPage + 1;

      // the popover ids start at 3 and Amazon increments them in the order the elements are clicked,
      // so the first opened popover has #a-popover-3, the next #a-popover-4, #a-popover-5 etc.
      const popoverContent = `#a-popover-content-${orderIndex + 1} ${selectors.list.popoverLinks}`;

      context.orderNumber = orderNumber;

      try {
        const s = selectors.list;
        const order = `${s.order}:nth-of-type(${orderIndex})`;

        // get metadata of order
        context.orderDetails = await getOrderDetails(page, order);
        orderData.push(context.orderDetails);

        const popoverTrigger = await page.$(`${order} ${s.popoverTrigger}`);
        await popoverTrigger.click();
        await page.waitFor(popoverContent); // the popover content can take up to 1-3 seconds to load

        await page.evaluate(
          async (sel, context) => {
            // we are in browser context now and don't have access to outside variables and functions
            // unless they are passed down (done here with as variable 'context');
            // all console.logs in here are logged in the console of the Chromium instance;

            // convert an ArrayBuffer to an UTF-8 string
            const ab2str = buffer => {
              const bufView = new Uint8Array(buffer);
              let addition = Math.pow(2, 8) - 1;
              let result = '';

              for (let i = 0, l = bufView.length; i < l; i += addition) {
                if (i + addition > l) {
                  addition = l - i;
                }

                result += String.fromCharCode.apply(null, bufView.subarray(i, i + addition));
              }

              return result;
            };

            document.querySelectorAll(sel).forEach(async link => {
              // Amazon invoice links match either pattern 'Rechnung 1' or pattern 'Rechnung oder Gutschrift 1'
              const invoiceLinkRegex = /^Rechnung( oder Gutschrift)?\s[0-9]{1,2}/;

              const isInvoiceLink = invoiceLinkRegex.test(link.innerText);
              if (isInvoiceLink) {
                // download invoice to output folder

                // for 3rd party merchants only a delivery note is available
                // and a proper invoice must be requested from the merchant
                const requestInvoice = link.href.includes('generated_invoices') ? 'ANFORDERN_' : '';

                return fetch(link.href, {
                  credentials: 'same-origin', // useful for sending cookies when logged in
                  responseType: 'arraybuffer',
                })
                  .then(response => response.arrayBuffer())
                  .then(arrayBuffer => {
                    const aBString = ab2str(arrayBuffer);
                    const path = `${context.outputFolder}/${requestInvoice}Amazon_Rechnung_${context.orderNumber}.pdf`;

                    return window.writeABString(aBString, path);
                  })
                  .catch(e => console.error('Request failed', e));
              }
            });
          },
          popoverContent,
          context
        );
      } catch (e) {
        const resultsPage = Math.ceil(i / resultsPerPage);
        logError(`Failed to process order ${orderNumber}, orderIndex ${orderIndex}, page ${resultsPage}`);
        logError(e);

        const path = `${outputFolder}/FAILED__${orderNumber}.png`;
        await page.screenshot({
          fullPage: true,
          path,
        });
        failedExports.push(`Order ${orderNumber}, see screenshot ${path}`);
      }
    }

    logStatus(`Invoices saved as PDF in folder /output/${year}`);
  }

  await browser.close();
  const orderDataFile = './output/order_data.csv';
  fs.writeFile(orderDataFile, orderDataToCSV(orderData));
  logResults(failedExports, args, orderDataFile);
})();
