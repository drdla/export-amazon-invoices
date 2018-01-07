import {orderPageBase} from './urls';

const listOrdersOfYear = (year, offset = 0) => {
  const baseUrl = orderPageBase;
  const args = {
    orderFilter: `year-${year}`,
    startIndex: offset,
  };
  const queryString = Object.keys(args)
    .map(k => (args[k] ? `${k}=${args[k]}` : ''))
    .filter(Boolean)
    .join('&');

  return [baseUrl, queryString].filter(Boolean).join('?');
};

export default listOrdersOfYear;
