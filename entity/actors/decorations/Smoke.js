'use strict';

import Entity from '../../Entity.js';
// import EntityFactory from '../../EntityFactory.js';
import SpriteRender from '../../components/SpriteRender.js';

import Vec2 from '../../../math/Vec2.js';

export default function createSmoke() {
  let e = new Entity({ name: 'smoke' });

  let sz = 25;
  e.opacity = 0.8;


  let spriteRender = new SpriteRender(e, { width: sz, height: sz, layer: 20 });
  spriteRender.draw = function() {
    p3.save();
    p3.stroke(200);
    p3.strokeWeight(1);
    // p3.translate(e.pos.x, e.pos.y);
    p3.fill(64, 64, 64, 0.3);
    p3.ellipse(0, 0, sz, sz);
    p3.restore();
  };
  e.addComponent(spriteRender);

  e.updateProxy = function(dt) {

    e.opacity -= dt;
    if(e.opacity < 0){
      e.opacity = 0;
    }
    console.log(e.opacity);

    // console.log('smoke update');
  };

  return e;
}