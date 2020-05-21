'use strict';

import Vec2 from '../math/Vec2.js';

/*
  Req.
   - Must be extendible
   If we create a new Object type, we should be able to integrate Pool easily

   - Must be Testable
   We need to be able to toggle the pool to see if we are getting any of its benefits

  - Should be fast
  Acquiring a new object type should run at O(1) or O(log N)
*/

let pools = {};

export default class Pool {

  static init(cfg) {
    // cfg.forEach({
    Pool.allocate({ name: 'vec2', type: Vec2, count: 500 });
    // });
  }

  /*
    cfg
      name {String}
      type {Function}
      count {Number}
  */
  static allocate(cfg) {
    let n = cfg.name;

    pools[n] = new Array(cfg.count);
    let newPool = pools[n];

    Pool.callCreateFuncs(newPool, 0, cfg.count, cfg);
  }

  static callCreateFuncs(p, s, e, cfg) {
    for (let i = s; i < e; i++) {

      if (cfg.createFunc) {
        p[i] = cfg.createFunc();
      } else {
        p[i] = new cfg.type;
      }

      p[i]._pool = {
        available: true,
        idx: i,
        name: cfg.name
      }
    }
  }

  /*
   */
  static grow(n) {
    let pool = pools[n];
    let oldSize = pool.length;

    let newSize = oldSize * 2;
    pool.length = newSize;
    console.info(`Pool: No free slots for "${n}". Growing to: ${newSize}.`);

    Pool.callCreateFuncs(pool, oldSize, newSize * 2, { name: 'vec2', type: Vec2 });
  }

  static free(obj) {
    let meta = obj._pool;
    if(meta){
      pools[meta.name][meta.idx]._pool.available = true;
    }
  }

  static get(n) {
    // is this here for testing?
    // return new Vec2();
    let pool = pools[n];

    for (let i = 0; i < pool.length; ++i) {
      if (pool[i]._pool.available) {

        // if (n === 'bullet') {
        //   window.count--;
        // }

        let obj = pool[i];
        obj._pool.available = false;
        obj.reset();
        return obj;
      }
    }

    Pool.grow(n);

    return Pool.get(n);
  }
}