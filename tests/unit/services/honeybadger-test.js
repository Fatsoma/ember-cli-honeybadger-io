import { run } from '@ember/runloop';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import sinon from 'sinon';

module('Unit | Service | honeybadger', function(hooks) {
  setupTest(hooks);

  test('When #notify is invoked', function(assert) {
    assert.expect(7);

    let service = this.owner.lookup('service:honeybadger');

    let getScript = sinon.stub(service, '_getScript').callsFake(() => {
      return {
        done(callback) {
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

          run(callback);
        }
      }
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
});
