import Route from '@ember/routing/route';

export default Route.extend({
  model() {
    return new Error('javascript error');
  }
});
