'use strict';

import Component from './Component.js';
import Utils from '../../Utils.js';

export default class RemoveSelf extends Component {
  constructor(e, cfg) {
    super(e, 'removeself');

    let defaults = {
    	timer: 1
    };

    Utils.applyProps(this, defaults, cfg);
  }

  update(dt) {
  	this.timer -= dt;

  	if(this.timer <= 0){
      this.entity.removeSelf();
  	}
  }
}