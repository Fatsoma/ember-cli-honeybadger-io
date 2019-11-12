import RSVP from 'rsvp';
import Ember from 'ember';

export function initialize(appInstance) {
  let service = appInstance.lookup('service:honeybadger');

  Ember.onerror = function(error) {
    service.notify(error);
  };

  RSVP.on('error', function(error) {
    service.notify(error);
  });
}

export default {
  name: 'honeybadger',
  initialize
};
