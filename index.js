'use strict';

const getRepoInfo = require('git-repo-info');

module.exports = {
  name: require('./package').name

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
