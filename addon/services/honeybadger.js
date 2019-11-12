import Service from '@ember/service';
import { merge } from '@ember/polyfills';
import { assert } from '@ember/debug';
import { resolve, Promise } from 'rsvp';
import { run } from '@ember/runloop';
import { isPresent } from '@ember/utils';
import jQuery from 'jquery';
import { getOwner } from '@ember/application';
import { set } from '@ember/object';

const noop = () => {};

export default Service.extend({
  init() {
    this._super(...arguments);
    set(this, 'beforeNotify', noop);
  },

  notify(error) {
    return this._getSDK().then(
      () => {
        run(window.Honeybadger, 'notify', error);
      },
      noop,
      'service:honeybadger.notify'
    )
  },

  _getSDK() {
    if (typeof(window.Honeybadger) === 'object') {
      return resolve();
    }

    return new Promise((resolve/*, reject*/) => {
      this._getScript().done(() => {
        this._configure();
        run(null, resolve);
      });
    }, 'service:honeybadger:getSDK');
  },

  _config() {
    let config = this._resolveConfig();
    let { honeybadger } = config;

    assert(
      'service:honeybadger.config apiKey missing',
      isPresent(honeybadger.apiKey)
    );

    return merge(
      { environment: config.environment },
      honeybadger
    );
  },

  _resolveConfig() {
    return getOwner(this).resolveRegistration('config:environment');
  },

  _configure() {
    let config = this._config();

    window.Honeybadger.configure(config);
    window.Honeybadger.beforeNotify((notice) => {
      this.get('beforeNotify')(notice);
    });
  },

  _getScript() {
    return jQuery.getScript('//js.honeybadger.io/v0.5/honeybadger.min.js');
  },
});
