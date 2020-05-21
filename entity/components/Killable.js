'use strict';

import Component from './Component.js';
import Utils from '../../Utils.js';
// import Signal from '../../events/Signal.js';
import Event from '../../event/Event.js';

export default class Killable extends Component {

  constructor(e, cfg) {
    super(e, 'killable');
  
    let defaults = {
      timeToDeath: 0
    };

    Utils.applyProps(this, defaults, cfg);  

    this.timer = 0;
    this.dead = false;
    this.dying = false;

    this.onDeath = function() {
      this.entity.removeSelf();
    };
  }
  
  update(dt, entity) {
    if(this.dying){
      this.timer += dt;

      if(this.timer >= this.timeToDeath){
        this.dead = true;
        
        this.onDeath();
        
      }
    }
  }

  kill() {
    this.dying = true;
    new Event({ evtName: 'killed', data: this.entity }).fire();
  }
}