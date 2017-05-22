import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    return new Error('javascript error');
  }
});
