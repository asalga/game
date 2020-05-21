'use strict';

import Component from './Component.js';
import Utils from '../../Utils.js';

export default class BHVSequenceSelector extends Component {
  constructor(e, cfg) {
    super(e, 'bhvsequenceselector');

    this.reset();
    // this.state = 'none';
    // this.currNode = 0;

    this.tags.push('bhv');
    let defaults = {
    };
    Utils.applyProps(this, defaults, cfg);
  }

  init(){
    this.bhvChildCount = this.entity.getChildrenWithComponentTagName('bhv').length;
  }

  reset(){
    this.currNode = 0;
    this.currIter = 0;
    this.iterationsUntilDone = 1;
    this.state = 'none';

    this.resetChildren();
    // TODO: allow removing node after they've been visited?
    // if(cfg.doNoRepeat){}
  }

  resetChildren(){
    let arr = this.entity.children;
    arr.forEach( e => {
      let c = e.findComponentByTagName('bhv');
      c.reset();
    });
  }
  
  setIterations(n){
    this.iterationsUntilDone = n;
  }

  restart(){
  }

  execute(){
    if(this.state === 'done') return 'done';

    if(this.state === 'none') this.state = 'running';

    // TODO: change to use Tag Name
    let n = this.currNode;
    let c = this.entity.children[n].findComponentByTagName('bhv');
    let childState = c.execute();

    // Last child is done, then we are done
    if(childState === 'done'){
      this.currNode++;

      if(this.currNode === this.bhvChildCount-1){

        // We're at the last child node, but we have more iterations left
        if(this.currIter + 1 < this.iterationsUntilDone){
          this.currNode = 0;
          this.currIter++;
          this.resetChildren();
        }
        else{
          this.state = 'done';  
        }
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