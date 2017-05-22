import Ember from 'ember';
import { moduleFor } from 'ember-qunit';
import test from 'ember-sinon-qunit/test-support/test';

const { $: jQuery, run } = Ember;

moduleFor(
  'service:honeybadger',
  'Unit | Service | honeybadger',
  { needs: ['config:environment'] }
);

test('When #notify is invoked', function(assert) {
  assert.expect(5);

  let getScriptStub = this.stub(jQuery, 'getScript').callsFake(() => {
    return {
      done(callback) {
        window.Honeybadger = {
          configure() {
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

  service.notify(new Error('javascript error')).then(() => {
    assert.ok(
      getScriptStub.calledWith(
        '//js.honeybadger.io/v0.4/honeybadger.min.js'
      ),
      'It loads honeybadger.js'
    );
  });
});
