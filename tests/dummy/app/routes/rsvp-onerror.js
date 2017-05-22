import Ember from 'ember';

const { Route, RSVP: { reject } } = Ember;

export default Route.extend({
  model() {
    return reject('promise error');
  }
});
