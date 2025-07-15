import Service from '@ember/service';
import { getOwner } from '@ember/application';
import { run } from '@ember/runloop';
import { resolve, Promise } from 'rsvp';
import { tracked } from '@glimmer/tracking';
import { assert } from '@ember/debug';
import { isPresent } from '@ember/utils';

export default class HoneybadgerService extends Service {
  @tracked beforeNotify = () => {};

  async notify(error) {
    await this.setup();

    run(window.Honeybadger, 'notify', error);
  }

  async notifyAsync(error) {
    await this.setup();

    return run(window.Honeybadger, 'notifyAsync', error);
  }

  addBreadcrumb(name, options = {}) {
    return run(window.Honeybadger, 'addBreadcrumb', name, options);
  }

  async setup() {
    if (typeof window.Honeybadger === 'object') {
      return resolve();
    }

    await this.loadScript();

    this.configure();
  }

  get config() {
    let {
      env: { environment, honeybadger },
    } = this;

    assert(
      'service:honeybadger.config apiKey missing',
      isPresent(honeybadger.apiKey),
    );

    return { environment, ...honeybadger };
  }

  get env() {
    return getOwner(this).resolveRegistration('config:environment');
  }

  configure() {
    window.Honeybadger.configure(this.config);
    window.Honeybadger.beforeNotify((notice) => {
      return this.beforeNotify(notice);
    });
  }

  async loadScript() {
    return new Promise((resolve, reject) => {
      let script = document.createElement('script');

      script.type = 'text/javascript';
      script.async = true;
      script.src = 'https://js.honeybadger.io/v6.11/honeybadger.min.js';
      script.onload = resolve;
      script.onerror = reject;

      document.getElementsByTagName('head')[0].appendChild(script);
    });
  }
}
