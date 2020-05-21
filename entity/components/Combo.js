'use strict';

import Component from './Component.js';
import Utils from '../../Utils.js';

export default class Combo extends Component {
  constructor(e, cfg) {
    super(e, 'combo');

    let defaults = {};
    Utils.applyProps(this, defaults, cfg);

    this.combo = 0;
    this.best = 0;

    e.on('hit', data => {
      this.combo++;
      if(this.combo > this.best){
        this.best = this.combo;
      }
    }, e);

    e.on('typo', data => {
      this.combo = 0;
    }, e);
  }

  update(dt) {
  }
}