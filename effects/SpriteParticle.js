'use strict';

export default class SpriteParticle {

  constructor(cfg) {
    this.sprite = cfg.sprite;

    this.isAlive = true;
    this.timer = 0;

    // this.position = createVector();
    this.trailsOn = cfg.trailsOn;
    this.trailsWidth = cfg.trailsWidth;

    this.mutator = null;

    // TODO FIX
    this.center = createVector(this.sprite.img.width, this.sprite.img.width);

    this.size = cfg.size;
    this.position = cfg.position;

    this.col = cfg.col;
    this.pos = cfg.pos;
    this.pxCount = cfg.pos.length / 2;

    this.vel = new Float32Array(this.pxCount * 2);
    this.acc = new Float32Array(this.pxCount * 2);
    // this.rot = new Float32Array(this.pxCount);
    // this.alphaSpeed = new Float32Array(this.pxCount);
  }

  render(gfx) {

    if (this.isAlive === false) {
      debugger;
      return;
    }
    let x, y;
    let r, g, b, a;

    gfx.push();
    // gfx.translate(this.position.x, this.position.y);
    gfx.noStroke();

    for (let i = 0; i < this.pxCount; i++) {
      x = this.pos[i * 2 + 0] * this.size * 2;
      y = this.pos[i * 2 + 1] * this.size * 3;

      r = this.col[i * 4 + 0];
      g = this.col[i * 4 + 1];
      b = this.col[i * 4 + 2];
      a = this.col[i * 4 + 3];

      // gfx.vertex(x,y);
      // gfx.stroke(r,g,b,a);
      // gfx.point(x,y);

      gfx.fill(r, g, b, a);
      gfx.rect(x, y, this.size * this.size * 3, this.size * this.size * 3);
    }

    // let t1 = new Date();
    // for (let i = 0; i < this.pxCount; i++) {
    //	if(i % 13 == 0){
    // this.trails[i].draw(i);
    //	}
    // }
    // 		let t2 = new Date();

    // 		this.totalTime += (t2-t1);
    // 		stroke(255);
    gfx.pop();
  }

  update(dt) {
    this.timer += dt;
    this.mutator && this.mutator.update(dt);

    if (this.timer > 1.5) {
      // this.isAlive = false;
    }
  }

  clearArray(arr) {
    for (let i = 0; i < arr.length; i++) {
      arr[i] = 0;
    }
  }

  clearAcceleration() {
    this.clearArray(this.acc);
  }

  clearVelocities() {
    this.clearArray(this.vel);
  }

  resetPositions() {
    this.copyArray(this.pos, this.sprite.pos);
  }

  resetColors() {
    this.copyArray(this.col, this.sprite.col);
  }

  reset() {
    this.resetColors();
    this.isAlive = true;
    this.timer = 0;

    this.resetPositions();
    this.clearAcceleration();
    this.clearVelocities();

    this.mutator && this.mutator.reset();
  }

  copyArray(dst, src) {
    let len = src.length;
    for (let i = 0; i < len; i++) {
      dst[i] = src[i];
    }
  }

  // push(v, p) {
  //  let _temp = createVector();
  //  let m = 1;
  //  let _dist;// = createVector();

  //   for (let i = 0; i < this.pxCount; i++) {	
  // 		_temp.set(this.pos[i*2 + 0], this.pos[i*2 +1]);

  // 	  _dist = 1 / (0.99**(_temp.dist(p)));

  // 		// _temp.sub(v, p)*1;

  // 		//m = _temp.mag() * .05;

  //      this.acc[i * 2 + 0] +=  v.x  * (_dist) * 10;
  //      this.acc[i * 2 + 1] +=  v.y  * (_dist) * 10;

  // 	 // if(i === 0){console.log(this.acc[i * 2 + 0]);}

  // 	}
  // }


}




//   update(dt) {

//     if (this.timerStarted) {
//       this.timer += dt;
//       if (this.timer > 2) {
//         this.timer = 0;
//         this.timerStarted = false;
//         this.reset();

//         this.trails = [];
//         for (let i = 0; i < this.pxCount; i++) {
//           this.trails[i] = this.getTrail();
//         }

//       }
//     }

//   }


//   }