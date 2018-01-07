import leftPad from 'left-pad';
import slugify from 'slugify';

const numberOfDigits = num => (Math.log10((num ^ (num >> 31)) - (num >> 31)) | 0) + 1;

const getOrderNumber = (orderNumber, year, numberOfOrders) =>
  slugify(`${year} ${leftPad(orderNumber, numberOfDigits(numberOfOrders), '0')}`, '_');

export default getOrderNumber;
