import Ember from 'ember';
import { moduleFor } from 'ember-qunit';
import test from 'ember-sinon-qunit/test-support/test';
import sinon from 'sinon';

const { $: jQuery, run } = Ember;

moduleFor(
  'service:honeybadger',
  'Unit | Service | honeybadger',
  { needs: ['config:environment'] }
);

test('When #notify is invoked', function(assert) {
  assert.expect(7);

  let getScriptStub = this.stub(jQuery, 'getScript').callsFake(() => {
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

            assert.ok(true, 'It invokes #configure on Honeybadger global');
          },
          beforeNotify() {
            assert.ok(true, 'It invokes #beforeNotify on Honeybadger global');
          },
          notify(error) {
            assert.equal(
              error.message,
              'javascript error'
            )

            assert.ok(true, 'It invokes #notify on Honeybadger global');
          }
        }

        run(callback);
      }
    }
  });

  let service = this.subject();

  let configStub = sinon.stub(service, '_resolveConfig').callsFake(() => {
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
      getScriptStub.calledWith(
        '//js.honeybadger.io/v0.5/honeybadger.min.js'
      ),
      'It loads honeybadger.js'
    );
  });
});
