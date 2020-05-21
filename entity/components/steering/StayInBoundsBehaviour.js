'use strict';

import Component from '../Component.js';
import Utils from '../../../Utils.js';
import Pool from '../../../core/Pool.js';
import Vec2 from '../../../math/Vec2.js';

export default class StayInBoundsBehaviour extends Component {

  /*
    cfg
      bounds {x,y,w,h}
  */
  constructor(e, cfg) {
    super(e, 'stayinbounds');

    this.acc = Pool.get('vec2');
    this.steer = Pool.get('vec2');
    this.desired = Pool.get('vec2');

    let defaults = {
      maxSpeed: 100,
      steerMag: 1
    };
    Utils.applyProps(this, defaults, cfg);

    // Maybe move this to accept something from cfg?
    Vec2.randomDir(e.vel);
    e.vel.mult(this.maxSpeed);
  }

  update(dt, entity) {
    this.stayInBounds();

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

  applyDesired() {
    this.steer.setV(this.desired.sub(this.entity.vel));
    this.steer.limit(this.steerMag);
    this.acc.add(this.steer);
  }

  stayInBounds() {

    if (this.entity.pos.x < this.bounds.x) {
      this.desired.setXY(this.maxSpeed, this.entity.vel.y);
      this.applyDesired();
    }

    if (this.entity.pos.y < this.bounds.y) {
      this.desired.setXY(this.entity.vel.x, this.maxSpeed);
      this.applyDesired();
    }

    if (this.entity.pos.x > this.bounds.w) {
      this.desired.setXY(-this.maxSpeed, this.entity.vel.y);
      this.applyDesired();
    }

    if (this.entity.pos.y > this.bounds.h) {
      this.desired.setXY(this.entity.vel.x, -this.maxSpeed);
      this.applyDesired();
    }

    this.applyForce(this.acc);
  }

  free() {
    debugger;
  }

  indicateRemove() {
    Pool.free(this.acc);
    Pool.free(this.steer);
    Pool.free(this.desired);
  }
}