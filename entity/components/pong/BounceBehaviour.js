'use strict';

import Component from '../Component.js';
import Utils from '../../../Utils.js';

export default class BounceBehaviour extends Component {

  constructor(e, cfg) {
    super(e, 'bouncebehaviour');

    let defaults = {};
    Utils.applyProps(this, defaults, cfg);

    this.entity.vel.set(random(-1, 1), random(-1, 1));
    this.entity.vel.normalize();
    this.entity.vel.mult(10);
  }

  update(dt, entity) {
    this.timer += dt;
    let r = this.entity.bounds.radius;

    if (this.entity.pos.x + r > width) {
      this.entity.vel.x *= -1;
    }

    if (this.entity.pos.y + r > height) {
      this.entity.vel.y *= -1;
    }

    if (this.entity.pos.x < 0) {
      this.entity.vel.x *= -1;
    }

    if (this.entity.pos.y - r < 0) {
      this.entity.vel.y *= -1;
    }
  }
}