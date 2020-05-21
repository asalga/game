'use strict';

import Component from '../Component.js';
import Utils from '../../../Utils.js';
import Pool from '../../../core/Pool.js';
import Vec2 from '../../../math/Vec2.js';

export default class SeparateBehaviour extends Component {

  /*
    cfg
      distance {Number}
  */
  constructor(e, cfg) {
    super(e, 'separate');

    this.acc = Pool.get('vec2');
    this.steer = Pool.get('vec2');
    this.desired = Pool.get('vec2');
    this.res = Pool.get('vec2');
    this._mag = Pool.get('vec2');
    this._temp = Pool.get('vec2');

    this.otherSprites = null;

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
    this.separate();

    this.entity.vel.add(this.acc);
    // this.limitMaxVelocity();
    this.acc.zero();
  }

  applyForce(a) {
    this.acc.add(a);
  }

  // limitMaxVelocity() {
  //   if (this.entity.vel.length() > this.maxSpeed) {
  //     this.entity.vel.normalize();
  //     this.entity.vel.mult(this.maxSpeed);
  //   }
  // }

  applyDesired() {
    this.steer.setV(this.desired.sub(this.entity.vel));
    this.steer.limit(this.steerMag);
    this.acc.add(this.steer);
  }

  /*
    Separate from all other entities in the scene
  */
  separate() {
    this.res.zero();

    let m;
    let count = 0;
    scene.entities.forEach(e => {
      if (e !== this.entity) {
        
        Vec2.sub(this._temp, this.entity.pos, e.pos);
        m = this._temp.mag();

        if (m < this.minDistance && m > 0) {
          count++;
          this._temp.normalize();
          this._temp.div(m);
          this.res.add(this._temp.x, this._temp.y);
        }
      }
    });

    if (count > 0) {
      this.res.div(count);
      this.res.normalize();
      this.res.mult(100);//window.maxSteer);

      let steer = this.res.clone();
      steer.sub(this.entity.vel);

      steer.limit(window.maxTest);

      this.applyForce(steer);
    }
  }

  free() {
    debugger;
  }

  indicateRemove() {
    Pool.free(this.acc);
    Pool.free(this.steer);
    Pool.free(this.desired);
    Pool.free(this.res);
    Pool.free(this._mag);
    Pool.free(this._temp);
  }
}