'use strict';

import Entity from '../../Entity.js';
// import EntityFactory from '../../EntityFactory.js';
import Vec2 from '../../../math/Vec2.js';
import Utils from '../../../Utils.js';

import SpriteRender from '../../components/SpriteRender.js';


let _v = Vec2.create();
/*
  1) Image should be sent to Emitter
  2) Emitter is given max size
  3) Particle are added to the scene

  x) test re-creating the path buffer per frame
  x) layer particle system canvas
  x) Recycle the smoke emitter entity
  x) Run performance test
*/

/*
  On Emitter death:
  - When entity dies, it tells children
  - Emitter gets notice of root death 
    - it calls it's own stop()
    - tells children to manage themselves
*/
export default function createEmitter() {
  let e = new Entity({ name: 'emitter' });

  e.layer = 3;
  let p = null;

  // defaults
  let params = {
    count: 1,
    rate: 1,
    particle: 'null', // TODO: rename to particle sprite
    ageRange: [1, 1],
    sizeRange: [10, 10],
    opacityRange: [1, 1],
    velocityRange: [Vec2.create(), Vec2.create()]
  };
  let timer = 0;

  let isDead = false;
  let rate = 1;

  let _alive;

  let _pos;
  let _vel;

  let _age;
  let _maxAge;

  let _size;
  let _opacity;


  let spriteRender = new SpriteRender(e, { layerName: 'effect' });
  spriteRender.draw = function(_p3) {
    // this.p3.clearAll();
    for (let i = 0; i < p.length; i++) {
      if (!_alive[i]) { continue; }
      let sz = _size[i];
      let op = _opacity[i];
      _p3.stroke(`rgb(25, 25, 25, ${op})`);
      _p3.fill(`rgb(25, 25, 25, ${op})`);
      _p3.ellipse(_pos[i * 2], _pos[i * 2 + 1], sz, sz);
    }
    // p3.drawImage(this.sprite, this.p3.width / 2, this.p3.height / 2);
  };
  spriteRender.renderAtRoot = true;
  e.addComponent(spriteRender);

  // A bit strange here. We need the parent before we can add the event listener
  // e.on('childaddedtoparent', data => {
  //   let child = data.child;
  //   data.parent.on('remove', data => {
  //     child.stop();
  //   }, e, {
  //     onlyOnce: function(d) {
  //       return [d.parent, d.child];
  //     }
  //   });
  // });

  e.on('remove', data => {
    if (data === e.virtualParent) {
      e.isDead = true;
    }
  }, e);

  e.createParticle = function(idx) {
    _alive[idx] = true;

    _age[idx] = 0;
    _maxAge[idx] = p3.random(params.ageRange[0], params.ageRange[1]);

    // if (!_pos[idx]) {
    // _pos[idx] = new Vec2;
    // if (!window._count) {
    // window._count = 0;
    // }
    // window._count++;
    // }
    // 10 particles
    // 10 * 2 elements

    // 0  1  2
    // 01 23 45

    // if (!_vel[idx]) { _vel[idx] = new Vec2; }

    _v.zero();
    this.virtualParent.getWorldCoords(_v);

    // [_pos[idx].x, _pos[idx].y] = [v.x, v.y];
    _pos[idx * 2 + 0] = _v.x;
    _pos[idx * 2 + 1] = _v.y;

    // _vel[idx].x = p3.random(params.velocityRange[0].x, params.velocityRange[1].x);
    // _vel[idx].y = p3.random(params.velocityRange[0].y, params.velocityRange[1].y);
    _vel[idx * 2 + 0] = p3.random(params.velocityRange[0].x, params.velocityRange[1].x);
    _vel[idx * 2 + 1] = p3.random(params.velocityRange[0].y, params.velocityRange[1].y);

    _size[idx] = p3.random(params.sizeRange[0], params.sizeRange[1]);
    _opacity[idx] = p3.random(params.opacityRange[0], params.opacityRange[1]);
  };

  e.killParticle = function(idx) {
    _alive[idx] = false;
  };

  e.allParticlesDead = function() {
    let particlesAlive = _alive.filter(p => p);
    return particlesAlive.length === 0;
  };

  let findFreeParticle = function() {
    for (let i = p.length - 1; i > 0; --i) {
      if (!_alive[i]) {
        window.count++;
        return i;
      }
    }
    return -1;
  };


  e.update = function(dt) {
    timer += dt;
    // Debug.add(window._count);

    for (let i = 0; i < p.length; ++i) {
      if (_alive[i]) {

        _age[i] += dt;

        if (_age[i] > _maxAge[i]) {
          this.killParticle(i);
          continue;
        }

        _opacity[i] = 1 - (_age[i] / _maxAge[i]);
        _size[i] += dt * (_age[i] / _maxAge[i]) * 4;

        _v.set(_vel[i * 2 + 0], _vel[i * 2 + 1]);
        Vec2.multSelf(_v, dt);

        _pos[i * 2 + 0] += _v.x;
        _pos[i * 2 + 1] += _v.y;
      }
    }

    if (this.isDead) {
      if (this.allParticlesDead()) {
        this.removeSelf();
      }
      return;
    }

    if (timer > rate) {
      timer = 0;

      let idx = findFreeParticle();
      if (idx > -1) {
        this.createParticle(idx);
      }
    }
  };

  /*
    ageRange
    positionRange
    velocityRange
    colorRange
    doesFade
  */
  e.setup = function(cfg) {
    Utils.applyProps(params, cfg);

    rate = 1 / params.rate;

    p = new Array(params.count);

    _alive = new Array(p.length);

    _pos = new Float32Array(p.length * 2);
    _vel = new Float32Array(p.length * 2);

    _age = new Array(p.length);
    _maxAge = new Array(p.length);

    _size = new Array(p.length);
    _opacity = new Array(p.length);

    // for (let i = 0; i < p.length; ++i) {
    //   _alive.push(false);

    //   _pos.push(new Vec2;
    //   _vel.push(Vec2.rand().mult(10));

    //   _age.push(0);
    //   _maxAge.push(0);

    //   _size.push(0);
    //   _opacity.push(0);
    // }
  };

  e.play = function() {
    console.log('emitter play');
  };

  e.stop = function() {
    console.log('emitter stop');
    this.detachFromParent();
    this.isDead = true;
  };

  return e;
}