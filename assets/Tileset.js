export default class Tileset {

  constructor(meta, img) {
    Object.assign(this, meta);

    this._tiles = [];
    this._tiles.push({}); // 0 is null since Tiled starts at index 1

    for (let i = 0; i < this.tiles.length; i++) {

      let cvs = document.createElement('canvas');
      cvs.width = this.tilewidth;
      cvs.height = this.tileheight;
      let ctx = cvs.getContext('2d');
      let x = (i % this.columns) * 32;
      let y = Math.floor(i / this.columns) * 32;

      ctx.drawImage(img, x, y, this.tilewidth, this.tileheight, 0, 0, this.tilewidth, this.tileheight);
      this._tiles.push(cvs);
    }
  }

  /*
    id - Number or String?
  */
  get(id) {
    return this._tiles[id];
  }
};