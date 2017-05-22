import Ember from 'ember';
import { test } from 'qunit';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';
import sinon from 'sinon';

const { Test, Logger } = Ember;

moduleForAcceptance('Acceptance | ember onerror', {
  beforeEach() {
    this.sandbox = sinon.sandbox.create();

    // TODO: revist https://github.com/emberjs/ember.js/pull/14898
    this.sandbox.stub(Test.adapter, 'exception');
    this.sandbox.stub(Logger, 'error');
  },

  afterEach() {
    this.sandbox.restore();
    window.Honeybadger = undefined;
  }
});

test('visiting /ember-onerror', function(assert) {
  window.Honeybadger = {
    notify(error) {
      assert.equal(
        error.message,
        'javascript error'
      )
    }
  }

  visit('/ember-onerror');

  andThen(function() {
    assert.equal(currentURL(), '/ember-onerror');
  });
});
