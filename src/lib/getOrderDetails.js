import selectors from './selectors';

const getOrderDetails = async (page, order) => {
  const getDetails = async (name, attribute = 'innerText') =>
    await page.$eval(
      [order, selectors.list.orderDetails[name]].join(' '),
      (el, attribute) => (el ? el[attribute] : ''),
      attribute
    );

  // const article = await getDetails('article'); // TODO: handle multiple articles per offer
  const date = await getDetails('date');
  const id = await getDetails('id');
  const total = await getDetails('total');
  const url = await getDetails('url', 'href');

  return {
    // article,
    date,
    id,
    total: total.replace(/EUR\s([0-9,.]+)/g, '$1 €'),
    url,
  };
};

export default getOrderDetails;
