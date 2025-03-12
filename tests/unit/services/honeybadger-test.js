import { module, test } from 'qunit';
import { setupTest } from 'dummy/tests/helpers';
import sinon from 'sinon';

module('Unit | Service | honeybadger', function (hooks) {
  setupTest(hooks);

  hooks.afterEach(() => {
    window.Honeybadger = undefined;
  });

  test('it wraps honeybadger.js helpers', async function (assert) {
    let service = this.owner.lookup('service:honeybadger');

    let config = {
      environment: 'test-env',
      apiKey: 'test-key',
    };

    let configure = sinon.stub();
    let beforeNotify = sinon.stub();
    let notify = sinon.stub();
    let honeybadger = { configure, beforeNotify, notify };

    let getScript = sinon.stub(service, 'loadScript').callsFake(() => {
      window.Honeybadger = honeybadger;
    });

    let error = new Error('javascript error');

    sinon.stub(service, 'env').get(() => {
      return {
        honeybadger: config,
      };
    });

    await service.notify(error);

    assert.ok(getScript.calledOnce);
    assert.ok(configure.calledOnceWith(config));
    assert.ok(beforeNotify.calledOnce);
    assert.ok(notify.calledOnceWith(error));
  });
});
