import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import sinon from 'sinon';
import { resolve } from 'rsvp';

module('Unit | Service | honeybadger', function(hooks) {
  setupTest(hooks);

  hooks.afterEach(() => {
    window.Honeybadger = undefined;
  });

  test('When #notify is invoked', function(assert) {
    assert.expect(7);

    let service = this.owner.lookup('service:honeybadger');

    let getScript = sinon.stub(service, '_getScript').callsFake(() => {
      window.Honeybadger = {
        configure(config) {
          assert.deepEqual(
            config,
            {
              environment: 'test',
              apiKey: 'test-key'
            }
          );

          assert.ok(
            true,
            'It invokes #configure on Honeybadger global'
          );
        },
        beforeNotify() {
          assert.ok(
            true,
            'It invokes #beforeNotify on Honeybadger global'
          );
        },
        notify(error) {
          assert.equal(
            error.message,
            'javascript error'
          )

          assert.ok(
            true,
            'It invokes #notify on Honeybadger global'
          );
        }
      }

      return resolve();
    });

    let configStub = sinon.stub(
      service,
      '_resolveConfig'
    ).callsFake(() => {
      return {
        honeybadger: {
          environment: 'test',
          apiKey: 'test-key'
        }
      };
    });

    service.notify(new Error('javascript error')).then(() => {
      assert.ok(configStub.calledOnce);
      assert.ok(
        getScript.calledOnce,
        'It loads honeybadger.js'
      );
    });
  });

  test('On #notify when get script fails', function(assert) {
    assert.expect(3);

    let service = this.owner.lookup('service:honeybadger');

    let getError = new Error('failed to get script');
    let getScript = sinon.stub(service, '_getScript').rejects(getError);

    let configureStub = sinon.stub(service, '_configure').returns(null);

    let notifyError = 'Unable to send error report: Error: javascript error';
    let consoleError = sinon.stub(console, 'error').returns(null);

    service.notify(new Error('javascript error')).then(() => {
      assert.ok(getScript.calledOnce, 'it tries to laod honeybadger.js');
      assert.notOk(configureStub.called, 'it does not call configure');
      assert.ok(
        consoleError.withArgs(notifyError).calledOnce,
        'it logs passed error to console'
      );
    });
  });

  test('#resetMaxErrors', function(assert) {
    let service = this.owner.lookup('service:honeybadger');

    window.Honeybadger = sinon.stub();

    service.resetMaxErrors();

    assert.ok(window.Honeybadger.calledWith('resetMaxErrors'))
  })
});
