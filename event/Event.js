'use strict';

import EventSystem from './EventSystem.js';

export default class Event {
  constructor(data) {
    this.data = data;
    this.es = new EventSystem();
  }
  fire() {
    this.es.fire(this.data);
  }
}