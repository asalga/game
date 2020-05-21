'use strict';

import Assets from '../../../assets/Assets.js';
import Entity from '../../Entity.js';

import SpriteRenderAni from '../../components/SpriteRenderAnimation.js';
import WanderBehaviour from '../../components/steering/WanderBehaviour.js';
import StayInBoundsBehaviour from '../../components/steering/StayInBoundsBehaviour.js';
import SeparateBehaviour from '../../components/steering/SeparateBehaviour.js';

export default function createInky() {
  let e = new Entity({ name: 'inky' });

  e.pos.x = random(430, 500);
  e.pos.y = random(430, 530);

  let anims = Assets.get('pac_anim');
  let atlas = Assets.get('pac_atlas');

   let swithedAniTime = 0;

  e.updateProxy = function(dt) {
    swithedAniTime += dt;

    if (swithedAniTime < 0.1) {
      return;
    }




    if (this.vel.x > 0) {
      spriteRenderAni.play('inky_right');
      swithedAniTime = 0;
    } else {
      spriteRenderAni.play('inky_left');
      swithedAniTime = 0;
    }


  };

  let spriteRenderAni = new SpriteRenderAni(e, {
    layerName: 'sprite',
    atlas: atlas,
    animations: anims,
    animationTime: 1,
    loop: true,
    pingpong: false,
    currAnimation: 'inky_left'
  });

  let wander = new WanderBehaviour(e, {});

  let stayInBounds = new StayInBoundsBehaviour(e, {
    steerMag: 3,
    maxSpeed: 150,
    bounds: { x: 32, y: 32, w: scene.gameWidth - 64, h: scene.gameHeight - 64 }
  });

  let separateBehaviour = new SeparateBehaviour(e, {
    minDistance: 32
  });
  
  e.addComponent(separateBehaviour);
  e.addComponent(stayInBounds);
  e.addComponent(wander);
  e.addComponent(spriteRenderAni);

  return e;
}