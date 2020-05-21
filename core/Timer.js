'use strict';

export default class Timer {
  constructor() {
    this.time = 0;
    this.paused = false;
  }

  update(dt) {
    if (this.paused) { return; }
    this.time += dt;
  }

  elapsed() {
    return this.time;
  }

  reset() {
    this.time = 0;
  }

  pause() {
    this.paused = true;
  }

  resume() {
    this.paused = false;
  }
}