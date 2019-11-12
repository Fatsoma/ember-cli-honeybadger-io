import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { visit, currentURL } from '@ember/test-helpers';

module('Acceptance | ember onerror', function(hooks) {
  setupApplicationTest(hooks);

  hooks.afterEach(function() {
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
