const orderDataToCSV = orderData => {
  const separator = ';';
  const lineBreak = '\n';
  let csv = '';

  if (!Array.isArray(orderData) || !orderData.length) {
    return 'No order data!';
  }

  const keys = Object.keys(orderData[0]);

  const headerRow = keys.join(separator) + lineBreak;
  csv += headerRow;

  orderData.forEach(row => {
    const a = [];
    keys.forEach(k => a.push(row[k]));
    const dataRow = a.join(separator) + lineBreak;
    csv += dataRow;
  });

  return csv;
};

export default orderDataToCSV;
