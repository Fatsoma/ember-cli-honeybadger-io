/* eslint-env node */

const path = require('path');
const existsSync = require('exists-sync');
const mkdirp = require('mkdirp');
const isCI = !!process.env.CI;
const scenario = process.env.EMBER_TRY_CURRENT_SCENARIO;

let testReportsPath = 'test-results';
let reportFile = path.join(testReportsPath, `${scenario}-test-results.xml`);

if (existsSync(testReportsPath) === false) {
  mkdirp.sync(testReportsPath);
}

let options = {
  test_page: 'tests/index.html?hidepassed',
  disable_watching: true,
  xunit_intermediate_output: true,
  report_file: reportFile,
  launch_in_ci: [
    'Chrome'
  ],
  launch_in_dev: [
    'Chrome'
  ],
  browser_args: {
    Chrome: [
      '--disable-gpu',
      '--headless',
      '--remote-debugging-port=9222',
      '--window-size=1440,900'
    ]
  }
};

if (isCI) {
  options.reporter = 'xunit';
}

module.exports = options;
