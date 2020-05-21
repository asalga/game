'use strict';

import Utils from '../Utils.js';

let strings = [];
let isOn = true;

export default class Debug {

  static init(cfg) {
    document.addEventListener('keydown', function(evt) {
      if (evt.code === cfg.toggleKey) {
       // Debug.setOn(window.debug);
      }
    });
  }

  static add(str) {
    if (!isOn) {
      return;
    }
    strings.push(str);
  }

  static setOn(v) {
    isOn = v;
  }

  static draw() {
    if (!isOn) {
      return;
    }

    push();
    noStroke();
    fill(0, 255, 0);

    let y = 20;
    let ySpacing = 18;

    strings.forEach(s => {
      text(s, 10, y);
      y += ySpacing;
    });

    pop();
  }

  static postRender() {
    if (!isOn) {
      return;
    }
    Utils.clearArray(strings);
  }
}