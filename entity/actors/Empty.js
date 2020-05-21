'use strict';

import Entity from '../Entity.js';

export default function createEmpty() {
  
  let e = new Entity({ name: 'empty' });

  e.updateProxy = function(dt) {};

  return e;
}