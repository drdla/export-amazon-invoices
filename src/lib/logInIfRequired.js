import {log, logDetail, logError, logStatus} from './log';

import selectors from './selectors';

const logInIfRequired = async (page, args) => {
  const requiresLogin = await page.evaluate(sel => document.querySelectorAll(sel).length > 0, selectors.login.form);

  if (requiresLogin) {
    log();
    logStatus(`Logging into Amazon account ${args.user}`);

    try {
      await page.type(selectors.login.user, args.user);
      await page.type(selectors.login.password, args.password);
      await page.click(selectors.login.submit);

      await page.waitFor(selectors.list.page);
      logDetail('Logged in successfully');
    } catch (e) {
      logError(`Could not log in with\n  user      ${args.user}\n  password  ${args.password}`);
      log();
      process.exit();
    }
  }
};

export default logInIfRequired;
