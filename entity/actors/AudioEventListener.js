'use strict';

import Entity from '../Entity.js';
import Assets from '../../assets/Assets.js';

import Debug from '../../debug/Debug.js';
import cfg from "../../cfg.js";

export default function createAudioEventListener() {

  let e = new Entity({ name: 'audioeventlistener' });

  let assets = new Assets();
  let hurt = assets.get('audio', 'missed');

  e.on('missed', (evt) => {
    // hurt.play();
    console.log('missed');
  });

  return e;
}