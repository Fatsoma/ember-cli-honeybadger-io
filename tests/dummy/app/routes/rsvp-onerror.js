import Route from '@ember/routing/route';
import { reject } from 'rsvp';

export default Route.extend({
  model() {
    return reject('promise error');
  }
});
