'use strict';

import Component from './Component.js';
import Utils from '../../Utils.js';

export default class BHVLeaf extends Component {
  constructor(e, cfg) {
    super(e, 'bhvleaf');

    this.reset();

    this.tags.push('bhv');
    let defaults = {};
    Utils.applyProps(this, defaults, cfg);
  }

  reset(){
    this.state = 'none';
    this.timer = 0;
  }

  execute(){
    if(this.state === 'none'){
      if(this.exe){
        this.exe();
        this.state = 'running';
      }
    }

    return this.state;
  }

  update(dt) {
    if(this.state === 'running'){
      this.timer += dt;
      if(this.timer > 2.75){
        this.timer = 0;
        this.state = 'done';
      }
    }
  }
}