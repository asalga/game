'use strict';

/*
  Atlas.js
  
  cfg{
    name,
    p5Img,
    meta - string
  }
*/
export default function Atlas(cfg) {
  Object.assign(this, cfg);
  this.frames = {};
  this.split();
}

Atlas.prototype = {

  /*
    Do NOT use the filename extension (.png, .jpg);
  */
  get(str) {
    return this.frames[str];
  },

  /*
   */
  split() {
    let sheetData = JSON.parse(this.meta)['frames'];
    let arr;

    if (Array.isArray(sheetData)) {
      arr = sheetData;

      arr.forEach( f => {
        let filename = f.filename;
        let frame = f.frame;

        // remove '.png' part of filename, we don't need it.
        let imgName = filename.split('.')[0];
        this.frames[imgName] = this.p5Img.get(frame.x, frame.y, frame.w, frame.h);
      });

    } else {
      arr = Object.entries(sheetData);
      arr.forEach((f, i) => {
        let filename = f[0];
        let frame = f[1].frame;

        // remove '.png' part of filename, we don't need it.
        let imgName = filename.split('.')[0];
        this.frames[imgName] = this.p5Img.get(frame.x, frame.y, frame.w, frame.h);
      });
    }
  }
};