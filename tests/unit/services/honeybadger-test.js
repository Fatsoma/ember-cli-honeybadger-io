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
    let notifyAsync = sinon.stub();
    let addBreadcrumb = sinon.stub();

    let honeybadger = {
      configure,
      beforeNotify,
      notify,
      notifyAsync,
      addBreadcrumb,
    };

    let getScript = sinon.stub(service, 'loadScript').callsFake(() => {
      window.Honeybadger = honeybadger;
    });

    let error = new Error('javascript error');

    sinon.stub(service, 'env').get(() => {
      return {
        honeybadger: config,
      };
    });

    let setupSpy = sinon.spy(service, 'setup');

    let breadcrumb = {
      name: 'test-breadcrumb',
      options: {
        metadata: { id: 'honeybadger' },
        category: 'test',
      },
    };

    await service.addBreadcrumb(breadcrumb.name, breadcrumb.options);
    await service.notify(error);
    await service.notifyAsync(error);

    assert.ok(getScript.calledOnce);
    assert.ok(configure.calledOnceWith(config));
    assert.ok(beforeNotify.calledOnce);
    assert.ok(notify.calledOnceWith(error));

    assert.ok(
      addBreadcrumb.calledOnceWith(breadcrumb.name, breadcrumb.options),
    );

    assert.ok(notifyAsync.calledOnceWith(error));

    assert.ok(setupSpy.calledThrice);
  });
});
