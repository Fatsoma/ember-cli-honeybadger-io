import Ember from 'ember';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import sinon from 'sinon';

const { Test, Logger } = Ember;

module('Acceptance | ember onerror', function(hooks) {
  setupApplicationTest(hooks);

  hooks.beforeEach(function() {
    this.sandbox = sinon.sandbox.create();

    // TODO: revist https://github.com/emberjs/ember.js/pull/14898
    this.sandbox.stub(Test.adapter, 'exception');
    this.sandbox.stub(Logger, 'error');
  });

  hooks.afterEach(function() {
    this.sandbox.restore();
    window.Honeybadger = undefined;
  });

  test('visiting /ember-onerror', async function(assert) {
    window.Honeybadger = {
      notify(error) {
        assert.equal(
          error.message,
          'javascript error'
        )
      }
    }

    await visit('/ember-onerror');

    assert.equal(currentURL(), '/ember-onerror');
  });
});
