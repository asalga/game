'use strict';

import Vec2 from '../math/Vec2.js';

export default class Collision {
  static collided(e1, e2) {
    let rad = e1.bounds.radius + e2.bounds.radius;
    let dist = Vec2.Sub(e1.pos, e2.pos).length();
    return dist < rad;
  }
}