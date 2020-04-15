/* eslint-env node */

const path = require('path');
const fs = require('fs');
const mkdirp = require('mkdirp');
const isCI = !!process.env.CI;
const scenario = process.env.EMBER_TRY_CURRENT_SCENARIO;

let testReportsPath = 'test-results';
let reportFile = path.join(testReportsPath, `${scenario}-test-results.xml`);

if (fs.existsSync(testReportsPath) === false) {
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
  browser_start_timeout: 120,
  browser_args: {
    Chrome: {
      ci: [
        // --no-sandbox is needed when running Chrome inside a container
        process.env.CI ? '--no-sandbox' : null,
        '--headless',
        '--disable-dev-shm-usage',
        '--disable-software-rasterizer',
        '--mute-audio',
        '--remote-debugging-port=0',
        '--window-size=1440,900'
      ].filter(Boolean)
    }
  }
};

if (isCI) {
  options.reporter = 'xunit';
}

module.exports = options;
