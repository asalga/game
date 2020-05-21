'use strict';

import Component from './Component.js';
import Utils from '../../Utils.js';

/*
  We provide a layer to which the component renders to

  cfg:
    layerName {String}
    atlas {String}
    frames {Array}
    animation {String}
*/
export default class SpriteRenderAnimation extends Component {
  constructor(e, cfg) {
    super(e, 'spriterender');
    this.cfg = cfg;
    this.reset();
  }

  reset() {
    this.renderable = true;
    this.visible = true;
    this.opacity = 1;
    this.layer = this.cfg && this.cfg.layer || 0;
    Utils.applyProps(this, this.cfg);

    this.t = 0;
    this.delay = null;
    this.currAnimation = null;
    this.isPlaying = false;
    this.timeOffset = 0;
  }

  play() {
    if(this.isPlaying) return;

    this.isPlaying = true;
    this.t = 0;//millis();
  }

  pause() {
    this.isPlaying = false;
  }

  set frameDelay(f) {
    this.delay = Math.max(0, f);
  }

  routeFrame() {
    let msPerFrame = this.delay || this.animations[this.animation].time;
    let frames = this.animations[this.animation].frames;

    let t = this.t + this.timeOffset;
    // console.log(this.timeOffset);
    let idx = floor(t * 1000 / msPerFrame) % frames.length;

    let imgName = frames[idx];
    return this.atlas.get(imgName);
  }

  draw(p) {
    if (!this.animation) return;

    p.image(this.routeFrame(), this.entity.pos.x, this.entity.pos.y);

    this.drawProxy && this.drawProxy();
  }

  update(dt) {
    if (this.isPlaying) {
      this.t += dt;
    }
  }
}