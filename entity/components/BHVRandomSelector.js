'use strict';

import Component from './Component.js';
import Utils from '../../Utils.js';

export default class BHVRandomSelector extends Component {
  constructor(e, cfg) {
    super(e, 'bhvrandomselector');

    this.reset();

    this.tags.push('bhv');
    let defaults = {};
    Utils.applyProps(this, defaults, cfg);
  }

  reset(){
    this.state = 'none';
    this.currIndex = 0;
    this.currIter = 0;

    let arr = this.entity.children;//.findComponentsByTagName('bhv');
    arr.forEach( e => {
      let c = e.findComponentByTagName('bhv');
      c.reset();
    });

    // TODO: allow removing node after they've been visited?
    // if(cfg.doNoRepeat){}
  }

  setIterations(n){
    this.iterations = n;
  }

  getRandomIndex(){
    let n = this.entity.children.length;
    return Math.floor(random(0, n));
  }

  execute(){
    if(this.state === 'done') return 'done';

    if(this.state === 'none'){
      this.state = 'running';
      this.currIndex = this.getRandomIndex();
    }
    
    let n = this.currIndex;

    let child = this.entity.children[n].findComponentByTagName('bhv');
    let childState =child.execute();

    if(childState === 'done'){
      child.reset();
      this.currIter++;
      this.currIndex = this.getRandomIndex();
    
      if(this.currIter === this.iterations){
        this.state = 'done';
        console.log('randomselector done');
      }
    }

    return this.state;
  }

  update(dt) {
    if(this.entity.parent === null){
      this.execute();
    }
  }
}