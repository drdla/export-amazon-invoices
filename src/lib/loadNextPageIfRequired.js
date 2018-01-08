import listOrders from './listOrders';
import {logStatus} from './log';

// pager settings of Amazon
const resultsPerPage = 10; // TODO: extract to somewhere

const loadNextPageIfRequired = async (page, index, numberOfOrders, year) => {
  const resultsPage = Math.ceil(index / resultsPerPage);

  const isFirstResultOnPage = index % resultsPerPage === 1;
  if (isFirstResultOnPage) {
    logStatus(`Processing results page ${resultsPage} of ${Math.ceil(numberOfOrders / 10)}`);

    const offset = resultsPage * resultsPerPage;
    await page.goto(listOrders(year, offset), {waitUntil: 'load'});
  }
};

export default loadNextPageIfRequired;
