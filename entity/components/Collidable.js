'use strict';

import Component from './Component.js';

export default class Collidable extends Component {
  constructor(e, cfg) {
    super(e, 'collidable');
    this.cfg = cfg;
    this.reset();
  }

  reset() {
    this.enabled = true;
    this.type = (this.cfg && this.cfg.type) || 0x0;
    this.mask = (this.cfg && this.cfg.mask) || 0x0;
  }

}