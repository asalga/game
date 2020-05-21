'use strict';

import Component from './Component.js';
import Scene from '../../Scene.js';
import Event from '../../event/Event.js';

let matched = [];

export default class KBListener extends Component {

  constructor(e) {
    super(e, 'kblistener');

    window.addEventListener('keydown', evt => {

      // Find all matched glyphs
      for (let e of scene.entities) {

        // maybe instead filter for entities with letter components?
        if (!e.letter) {
          continue;
        }

        // handle both hiragana and en layout
        if ((e.letter.jpChar === evt.key || e.letter.enChar === evt.key) &&
          e.letter.hittable) {
          // (e.letter.wasMissed === false || e.letter.wasHit === false)) {
          matched.push(e);
        }
      }

      // a bit overkill by sorting them all but we have a small collection
      // and it keeps the code clean.
      if (matched.length > 0) {
        matched.sort((a, b) => a.pos.y - b.pos.y);
        matched[matched.length - 1].letter.hit();

        new Event({ evtName: 'hit', data: { key: evt.key } }).fire();
      } else {
        new Event({ evtName: 'typo', data: { key: evt.key } }).fire();
        new Event({ evtName: 'decreasescoreimmediate', data: { key: evt.key, onlyOnce: true } }).fire();
      }

      matched.length = 0;
    });
  }

  update(dt) {}
}