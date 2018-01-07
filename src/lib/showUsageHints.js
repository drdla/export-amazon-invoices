import commandLineUsage from 'command-line-usage';

import argDefinitions from './argDefinitions';

const usageHints = [
  {
    header: 'Export Amazon Invoices',
    content:
      'Mass exports invoices from a German Amazon account as PDF files.\nRequires the account credentials to log in.',
  },
  {
    header: 'Options',
    optionList: argDefinitions,
  },
  {
    header: 'Examples',
    content: [
      {
        desc: '1. Export all invoices of the [bold]{current} year',
        example: '$ yarn export -e foo@bar.com -p test1234',
      },
      {
        desc: '2. Export all invoices of a [bold]{given} year',
        example: '$ yarn export -e foo@bar.com -p test1234 -y 2017',
      },
      {
        desc: '3. Export all invoices of [bold]{multiple} years',
        example: '$ yarn export -e foo@bar.com -p test1234 -y 2018 2017 2016',
      },
    ],
  },
  {
    content: `Project home: [underline]{${require('../../package').homepage}}`,
  },
];

const showUsageHints = () => {
  console.log(commandLineUsage(usageHints));
  process.exit();
};

export default showUsageHints;
