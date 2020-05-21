'use strict';

import Component from './Component.js';
import Utils from '../../Utils.js';

export default class Template extends Component {
  constructor(e, cfg) {
    super(e, 'template');
    let defaults = {
    	
    };
    Utils.applyProps(this, defaults, cfg);
  }

  update(dt) {}
}