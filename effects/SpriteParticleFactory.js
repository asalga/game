'use strict';

import SpriteParticle from './SpriteParticle.js';

let Sprites = {};

export default class SpriteParticleFactory {

  static getPositionsAndColors(img, sz, maskFn) {
    img.loadPixels();

    let positions = [];
    let colors = [];
    let col, r, g, b, a;
    let x = 0,
      y = 0;
    let pxScale = 2;

    for (let i = 0; i < img.pixels.length; i += 4 * pxScale) {

      r = img.pixels[(i + 0)];
      g = img.pixels[(i + 1)];
      b = img.pixels[(i + 2)];
      a = img.pixels[(i + 3)];

      ////////////////////////////////////////////////////////////////
      if (!maskFn) {
        positions.push(x / 2, y / 2);
        colors.push(r, g, b, 255);
      } else if (maskFn(r, g, b, a)) {
        positions.push(x * sz / 2, y * sz / 2);
        colors.push(r, g, b, 255);
      }

      x += pxScale;
      // if (i > 0 && x % img.width === 0) {
      if (i > 0 && i % (img.width * 4 * 1) === 0) {
        x = 0;
        y += 2;
        i += img.width * 4 * pxScale;
      }
    }

    return [positions, colors];
  }

  static getSpriteData(name) {
    return Sprites[name];
  }

  static createSprite(cfg) {
    if (!Sprites[cfg.name]) debugger;

    // TODO: search for available sprites

    let _sprite = Sprites[cfg.name];
    let s = new SpriteParticle({
      sprite: _sprite,
      pos: _sprite.pos.slice(),
      col: _sprite.col.slice(),
      size: _sprite.size,
      position: cfg.position
    });

    return s;
  }

  /*
  	Iterate over all the entries in the Atlas and create a sprite
  	particle for each one
  */
  static initWithAtlas(atlas) {
    let maskFn = (r, g, b, a) => a === 255;

    let allChars = Object.entries(atlas.frames);

    allChars.forEach(f => {
      let name = f[0];
      let img = f[1];
      let size = 1;

      SpriteParticleFactory.allocateParticlesWithImage({ name, img, size, maskFn });
    });
  }

  /*
  	Call this if we already have the image and don't need to download it.
  */
  static allocateParticlesWithImage(cfg) {
    Sprites[cfg.name] = {
      'size': cfg.size,
      'img': cfg.img
    };

    let name = cfg.name;

    let [slowArrPos, slowArrCol] = SpriteParticleFactory.getPositionsAndColors(cfg.img, cfg.size, cfg.maskFn);
    let pxCount = slowArrPos.length / 2;

    // Sprites[name].img = cfg.img;
    Sprites[name].pxCount = pxCount;
    Sprites[name].pos = Float32Array.from(slowArrPos);
    Sprites[name].col = Uint8ClampedArray.from(slowArrCol);
    Sprites[name].opa = new Float32Array(pxCount);
  }

  /*
  	name, path, size
  */
  static allocateParticlesWithFile(cfg) {
    Sprites[cfg.name] = {
      'size': cfg.size,
      'path': cfg.path,
      'img': null
    };

    let maskFn = cfg.mask;

    loadImage(cfg.path, img => {
      let name = cfg.name;

      let [slowArrPos, slowArrCol] = SpriteParticleFactory.getPositionsAndColors(img, cfg.size, maskFn);
      let pxCount = slowArrPos.length / 2;

      Sprites[name].img = img;
      Sprites[name].pxCount = pxCount;
      Sprites[name].pos = Float32Array.from(slowArrPos);
      Sprites[name].col = Uint8ClampedArray.from(slowArrCol);
      Sprites[name].opa = new Float32Array(pxCount);
      // this.n = new Float32Array(pxCount);


      //       for (let i = 0; i < pxCount; i++) {
      //         this.trails[i] = this.getTrail();

      //         // 				this.pos[i*2+0] = x*this.sz;
      //         // 				this.pos[i*2+1] = y*this.sz;

      //         // 				x++;
      //         // 				if(i > 0 && (x % this.img.width === 0)){
      //         // 					x = 0;
      //         // 					y++;
      //         // 				//	console.log(x,y);
      //         // 				}

      //         this.alphaSpeed[i] = random(.85, 1);
      //         this.n[i] = noise(x * 10, y * 10) * 0.4;
      //         //	this.col = this.img.pixels.slice();
      //       }
      // this.pos = Float32Array.from(positions);
      // this.ori = this.pos.slice();

      // this.ready = true;
    });
  }

}