import chalk from 'chalk';

export const log = (content = '') => console.log(content);
export const logDetail = (content = '') => console.log(chalk.dim(' ', content));
export const logError = (content = '') => console.log(chalk.bgRed(' Error '), chalk.red(content));
export const logStatus = (content = '') => console.log(chalk.green('>', content));
