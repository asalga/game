'use strict';

/*

*/
export default class GameTimer {
  constructor(deltaTime = 1 / 60) {
    this.deltaTime = deltaTime;
    let accumTime = 0;
    let lastTime = 0;
    let that = this;

    this.tick = function tick(now) {

      // deltaTime = (now - lastTime) / 1000.0;
      accumTime += (now - lastTime) / 1000.0;

      if(accumTime > 1){
        accumTime = deltaTime;
      }

      while (accumTime > deltaTime) {
        that.update(deltaTime);
        accumTime -= deltaTime;
      }

      // setTimeout(update, 1000/15);
      // setTimeout(update, 1000 / 1, performance.now());
      requestAnimationFrame(that.tick);
      lastTime = now;
    };
  }

  start() {
    this.tick(0);
  }
}