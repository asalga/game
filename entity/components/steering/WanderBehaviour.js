'use strict';

import Component from '../Component.js';
import Utils from '../../../Utils.js';
import Pool from '../../../core/Pool.js';
import Vec2 from '../../../math/Vec2.js';

export default class WanderBehaviour extends Component {

  /*
    cfg
  */
  constructor(e, cfg) {
    super(e, 'wander');

    this.acc = Pool.get('vec2');
    this.steer = Pool.get('vec2');
    this.desired = Pool.get('vec2');
    this.d = Pool.get('vec2');

    let defaults = {
      maxSpeed: 100,
      steerMag: 1
    };
    Utils.applyProps(this, defaults, cfg);
    this.timer = 0;

    // Maybe move this to accept something from cfg?
    Vec2.randomDir(e.vel);
    e.vel.mult(this.maxSpeed);
  }

  wander(){
    Vec2.randomDir(this.d);
    this.d.mult(100);
    this.applyForce(this.d);
  }

  update(dt, entity) {
    this.timer += dt;
    if(this.timer > .1){
      this.timer = 0;
      this.wander();
    }

    this.entity.vel.add(this.acc);
    this.limitMaxVelocity();
    this.acc.zero();
  }

  applyForce(a) {
    this.acc.add(a);
  }

  limitMaxVelocity() {
    if (this.entity.vel.length() > this.maxSpeed) {
      this.entity.vel.normalize();
      this.entity.vel.mult(this.maxSpeed);
    }
  }

  free() {
    debugger;
  }

  indicateRemove() {
    Pool.free(this.d);
    Pool.free(this.acc);
    Pool.free(this.steer);
    Pool.free(this.desired);
  }
}