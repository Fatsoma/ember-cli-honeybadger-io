import Ember from 'ember';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import sinon from 'sinon';

const { Test, Logger } = Ember;

module('Acceptance | rsvp onerror', function(hooks) {
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

  test('visiting /rsvp-onerror', async function(assert) {
    window.Honeybadger = {
      notify(error) {
        assert.equal(
          error,
          'promise error'
        )
      }
    }

    await visit('/rsvp-onerror');

    assert.equal(currentURL(), '/rsvp-onerror');
  });
});
