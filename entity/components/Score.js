'use strict';

import Component from './Component.js';
import Utils from '../../Utils.js';

export default class Score extends Component {
  constructor(e, cfg) {
    super(e, 'score');
    let defaults = {
      pointsPerSecond: 1
    };
    Utils.applyProps(this, defaults, cfg);

    this.points = 0;
    this.toAdd = 0;
    this.timer = 0;
    this.rate = 1.25 / this.pointsPerSecond;

    e.on('increasescore', data => {
      this.toAdd += data.points;
    }, e);

    e.on('decreasescoreimmediate', data => {
      e.score.points -= 100;
      e.score.points = Math.max(0, e.score.points);
    }, e);


    e.on('missed', data => {
      e.score.points -= 100;
      e.score.points = Math.max(0, e.score.points);
    }, e);

  }

  update(dt) {

    if (this.toAdd > 0) {
      this.timer += dt;

      if (this.timer >= this.rate) {

        let howMuchThisFrame = Math.floor(this.timer / this.rate);

        if (howMuchThisFrame >= this.toAdd) {
          this.points += this.toAdd;
          this.toAdd = 0;
          this.timer = 0;
        } else {
          this.points += howMuchThisFrame;
          this.toAdd -= howMuchThisFrame;
          this.timer -= this.rate;
        }
        
      }
    }
  }
}