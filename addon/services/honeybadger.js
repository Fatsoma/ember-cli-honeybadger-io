import Service from '@ember/service';
import { assign } from '@ember/polyfills';
import { assert } from '@ember/debug';
import { resolve, Promise } from 'rsvp';
import { run } from '@ember/runloop';
import { isPresent } from '@ember/utils';
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
      this._getScript().then(() => {
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

    return assign(
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
    return new Promise((resolve, reject) => {
      let script = document.createElement('script');

      script.type = 'text/javascript';
      script.async = true;
      script.src = '//js.honeybadger.io/v2.2/honeybadger.min.js';
      script.onload = resolve;
      script.onerror = reject;

      document.getElementsByTagName('head')[0].appendChild(script);
    });
  },
});
