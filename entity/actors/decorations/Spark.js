'use strict';

import Entity from '../../Entity.js';
// import EntityFactory from '../../EntityFactory.js';
import SpriteRender from '../../components/SpriteRender.js';

import Vec2 from '../../../math/Vec2.js';

export default function createSpark() {
  let e = new Entity({ name: 'smoke' });
  
  let spriteRender = new SpriteRender(e, { layer: 100 });
  spriteRender.draw = function() {
    p3.save();
    p3.noStroke();
    p3.translate(e.pos.x, e.pos.y);
    // console.log(e.pos);
    p3.fill(64, 202, 238);
    //(100, 111, 140);
    p3.ellipse(0, 0, e.bounds.radius, e.bounds.radius);
    p3.restore();
  };
  e.addComponent(spriteRender);

  e.updateProxy = function(dt) {
    console.log('smoke update');
  };

  return e;
}