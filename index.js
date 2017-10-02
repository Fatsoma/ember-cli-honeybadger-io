/* eslint-env node */
'use strict';

const getRepoInfo = require('git-repo-info');

module.exports = {
  name: 'ember-cli-honeybadger-io',

  config(_environment, appConfig) {
    if (!this.app) {
      return;
    }

    let honeybadger = appConfig.honeybadger || {};
    let revisionType =  honeybadger.revisionType || 'abbreviatedSha';

    return {
      honeybadger: {
        revision: getRepoInfo()[revisionType]
      }
    };
  }
};
