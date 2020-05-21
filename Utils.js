'use strict';

let id = -1;

export default class Utils {
  static getEl(selector) {
    return document.getElementById(selector);
  }

  static noop() {}

  static getId() {
    return ++id;
  }

  /*
    returns true if the circle is completely contained inside the rectangle
  */
  static isCircleInsideRect(c, r) {
    return c.x - c.r > r.x &&
      c.x + c.r < r.x + r.w &&
      c.y - c.r > r.y &&
      c.y + c.r < r.y + r.h;
  }

  /*
   */
  static isPointIntersectingCircles(p, arr) {
    return arr.some(c => Utils.isPointInsideCircle(p, c));
  }

  static isPointInsideCircle(p, c) {
    _len = distance(p, c);
    return _len < c.radius;
  }

  /*
    c - circle
    r - rect
    max - max radius
  */
  static constrainCircleInRect(c, r, max) {
    let _r = max;
    let _right = Infinity;
    let _left = Infinity;
    let _up = Infinity;
    let _lower = Infinity;

    // right
    if (c.x + c.r > r.x + r.w) {
      _r = min(_r, r.x + r.w - c.x);
    }

    // left
    if (c.x - c.r < r.x) {
      _r = min(_r, c.x - r.x);
    }

    // lower
    if (c.y + c.r > r.y + r.h) {
      _r = min(_r, r.y + r.h - c.y);
    }

    // upper
    if (c.y - c.r < r.y){
     _r = min(_r, c.y - r.y);
    }

    c.r = _r;
    // if (_r < max) {
    //   c.r = _r;
    // }
  }

  /*
   */
  static isPointInsideRect(p, r) {
    return p.x >= r.x &&
      p.x <= r.x + r.w &&
      p.y >= r.y &&
      p.y <= r.y + r.h;
  }

  /*
   */
  static isCircleIntersectingRect(c, r) {
    let circleDistance = { x: 0, y: 0 };

    circleDistance.x = abs(c.x - (r.x + r.w / 2));
    circleDistance.y = abs(c.y - (r.y + r.h / 2));

    if (circleDistance.x > (r.w / 2 + c.r)) {
      return false;
    }
    if (circleDistance.y > (r.h / 2 + c.r)) {
      return false;
    }

    if (circleDistance.x <= (r.w / 2)) {
      return true;
    }
    if (circleDistance.y <= (r.h / 2)) {
      return true;
    }

    let cornerDistance_sq =
      (circleDistance.x - r.w / 2) * (circleDistance.x - r.w / 2) +
      (circleDistance.y - r.h / 2) * (circleDistance.y - r.h / 2);

    return (cornerDistance_sq <= (c.r * c.r));
  }

  static isCircleIntersectingCircle(c1, c2) {
    let x = c1.x - c2.x;
    let y = c1.y - c2.y;
    let len = sqrt(x * x + y * y);

    return len < (c1.r + c2.r);
  }

  static get undef() {
    return undefined;
  }

  static repeat(arr, count) {
    let arrCopy = arr.slice(0);

    for (let i = 0; i < count; ++i) {
      arr = arr.concat(arrCopy);
    }
    return arr;
  }

  /*
    Returns Array
  */
  static strIntersection(str1, str2) {
    let setB = new Set(str2);
    let res = [...new Set(str1)].filter(x => setB.has(x));
    return res;
  }

  static removeDuplicateChars(string) {
    return string
      .split('')
      .filter((item, pos, self) => {
        return self.indexOf(item) == pos;
      })
      .join('');
  }

  static applyProps(ctx, def, cfg) {

    Object.keys(def).forEach(k => {
      // if (ctx[k]) {
      // console.log(`${ctx[k]} already exists. Overwriting`);
      // }
      ctx[k] = def[k];
    });

    if (cfg) {
      Object.keys(cfg).forEach(k => {
        // if (ctx[k]) {
        // console.log(`${ctx[k]} already exists. Overwriting`);
        // }
        ctx[k] = cfg[k];
      });
    }
  }

  static distance(p1, p2, d) {
    let res = Vec2.sub(p1, p2);
    d = res.mag();
  }

  // playing around with perf testing
  // .length = [] vs allocating new array
  static clearArray(arr) {
    window.clearArrayCalls++;
    // arr = [];
    arr.length = 0;
  }

  // this is shit
  static removeFromArray(arr, el) {
    let idx = -1;
    for (let i = arr.length - 1; i > -1; --i) {
      if (el === arr[i]) {
        idx = i;
        break;
      }
    }

    if (idx === -1) {
      return false;
    }

    arr.splice(idx, 1);
    return true;
  }
}