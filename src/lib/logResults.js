import chalk from 'chalk';
import {log, logDetail, logError, logStatus} from './log';

import selectors from './selectors';

const logResults = (failedExports, args, orderDataFile) => {
  log();
  logStatus('Export complete');
  console.log(' ', chalk.dim('A CSV containing all order details was saved in'), orderDataFile);
  console.log(
    ' ',
    chalk.dim('Type'),
    args.year.length === 1 ? `open ./output/${args.year[0]}` : 'open ./output',
    chalk.dim('to view the exported files')
  );
  if (failedExports.length) {
    log();
    logError(`${failedExports.length} failed export${failedExports.length === 1 ? '' : 's'}:`);
    logDetail(failedExports.join('\n  '));
  }
  log();
};

export default logResults;
