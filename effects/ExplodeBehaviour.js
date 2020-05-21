'use strict';

import cfg from '../cfg.js';

function sign(n) {
  return n > 0 ? 1 : -1;
}
let Gravity = 6;


class Behaviour {
  constructor(cfg) {
    this.sprite = cfg.sprite;
  }

  applyForce(v) {
    for (let i = 0; i < this.sprite.pxCount; i++) {
      this.sprite.acc[i * 2 + 0] += v.x;
      this.sprite.acc[i * 2 + 1] += v.y;
    }
  }
}


export default class Explode extends Behaviour {

  constructor(cfg) {
    super(cfg);
    this.target = cfg.target;
    this.isDone = cfg.isDone || function() {};
    this.alphaSpeed = new Float32Array(cfg.sprite.pxCount);
    this.reset();
  }

  execute(p) {
    this.isPlaying = true;

    let v = createVector();
    let m;
    let up = -10;
    this.posOnExplode = createVector(this.sprite.position.x, this.sprite.position.y);
    console.log(this.posOnExplode);

    for (let i = 0; i < this.sprite.pxCount; ++i) {

      v.set(this.sprite.pos[i * 2 + 0], this.sprite.pos[i * 2 + 1]);
      v.sub(p);
      m = v.mag() * 1;

      // this.sprite.acc[i * 2 + 0] +=      (50 / m) * v.x + sign(v.x) + (noise((i + this.noiseOffset) * 13) * 2 - 1) * 15;
      // this.sprite.acc[i * 2 + 1] += up + (50 / m) * v.y + sign(v.y) + (noise((i + this.noiseOffset) * 13) * 2 - 1) * 15;

      // this.sprite.acc[i * 2 + 0] += (50 / m) * v.x + sign(v.x) + (noise((i + this.noiseOffset) * 13) * 2 - 1) * 150;
      // this.sprite.acc[i * 2 + 1] += up + (50 / m) * v.y + sign(v.y) + (noise((i + this.noiseOffset) * 3) * 2 - 1) * 50;
    this.sprite.acc[i * 2 + 0] += (50 / m) * v.x + sign(v.x) + (noise((i + this.noiseOffset) * 13) * 2 - 1) * 10;
    this.sprite.acc[i * 2 + 1] += up + (50 / m) * v.y + sign(v.y) + (noise((i + this.noiseOffset) * 3) * 2 - 1) * 8;
      // this.sprite.acc[i * 2 + 0] +=      (50 / m) * v.x;
      // this.sprite.acc[i * 2 + 1] += up + (50 / m) * v.y;
    }
  }

  reset() {
    this.sprite.reset();

    this.noiseOffset = random(0, 1);
    this.isPlaying = false;

    let a;
    for (let i = 0; i < this.sprite.pxCount; ++i) {
      // a = random(0.4, 0.8) + (noise((x + this.offset), (y + this.offset)));
      a = random(0.5, 0.7);
      // this.alphaSpeed[i] = a * 400;
      this.alphaSpeed[i] = a * 10;
    }
  }

  update(dt) {
    if (this.isPlaying) {
      this.applyForce(createVector(0, Gravity));
    }

    let done = true;

    let v = this.sprite.vel;
    let a = this.sprite.acc;
    let p = this.sprite.pos;

    let sp = this.posOnExplode;
    for (let i = 0; i < this.sprite.pxCount; ++i) {

      // this.trails[i].add({x:this.pos[i*2+0], y: this.pos[i*2+1]});

      v[i * 2 + 0] += a[i * 2 + 0];
      v[i * 2 + 1] += a[i * 2 + 1];

      p[i * 2 + 0] += dt * v[i * 2 + 0];
      p[i * 2 + 1] += dt * v[i * 2 + 1];

      // bounce off walls
      if (sp.x + p[i * 2] * 2 < 0) {
        v[i * 2] *= -1;
      }
      if (sp.x + p[i * 2] * 2 > cfg.gameWidth) {
        v[i * 2] *= -1;
      }

      // bounce off floor
      if (sp.y + p[i * 2 + 1] * 3 >= cfg.gameHeight) {
        
        // a[i * 2 + 1] += -v[i * 2 + 1];
         
        // p[i * 2 + 1] = 0;
        // this.applyForce(createVector(0, -10));
    //for (let j = 0; j < this.sprite.pxCount; j++) {
        
        v[i * 2 + 1] /= 2;
        v[i * 2 + 1] = -v[i * 2 + 1];

      // this.sprite.col[i * 4 + 3] -= 50;

      // p[i*2+1] = 200;
      
      // this.sprite.col[i  + 0] = 255;
      // this.sprite.col[i  + 1] = 255;
      // this.sprite.col[i  + 2] = 255;
      // this.sprite.col[i  + 3] = 255;


      // this.sprite.acc[j * 2 + 1] += v.y;
    //}
        // a[i*2+0] = 0;
        // a[i*2+0] = 115;

        // a[i * 2 + 0] = -99990;//random(0.5, 0.9);
      }

      this.sprite.col[i * 4 + 3] -= dt * this.alphaSpeed[i];

      if (this.sprite.col[i * 4 + 3] > 100) {
        done = false;
      }
    }


    if (done) {
      this.isDone();
    } else {
      this.sprite.clearAcceleration();
    }
  }
}


// let x, y, rot, a;
// this.offset = this.sprite.position.x /100;

// for(let i = 0; i < this.sprite.pxCount; i++){

// 	x = this.sprite.pos[i * 2 + 0] / 150;
// 	y = this.sprite.pos[i * 2 + 1] / 150;

// 	rot = (noise(x + this.offset, y + this.offset))-1;

// 	this.flowField[i*2 +0] = cos(rot * TWO_PI) * 10;
// 	this.flowField[i*2 +1] = sin(rot * TWO_PI) * 10;
// }

// for (let i = 0; i < this.pxCount; i++) {
//   this.trails[i].add({
//     x: this.pos[i * 2 + 0],
//     y: this.pos[i * 2 + 1]
//   });
// }