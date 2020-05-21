'use strict';

import Component from './Component.js';
import Utils from '../../Utils.js';

export default class Timer extends Component {
  constructor(e, cfg) {
    super(e, 'timer');

    let defaults = {};
    Utils.applyProps(this, defaults, cfg);

    this.reset();
  }

  reset(){
    this.time = 0;
  }

  update(dt) {
    this.time += dt;

    if(this.time > this.countdown){
      this.cb && this.cb();
    }
  }
}