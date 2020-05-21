'use strict';

import Entity from '../Entity.js';
// import EntityFactory from '../EntityFactory.js';

import KBListener from '../components/KBListener.js';

import Debug from '../../debug/Debug.js';

export default function createLetter() {
  
  let e = new Entity({ name: 'keyboardlistener' });

  let kb = new KBListener(e);
  e.addComponent(kb);

  e.updateProxy = function(dt) {};

  return e;
}