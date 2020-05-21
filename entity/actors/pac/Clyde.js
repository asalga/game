'use strict';

import Assets from '../../../assets/Assets.js';
import Entity from '../../Entity.js';

import SpriteRenderAni from '../../components/SpriteRenderAnimation.js';
import FollowBehaviour from '../../components/steering/FollowBehaviour.js';
import StayInBoundsBehaviour from '../../components/steering/StayInBoundsBehaviour.js';
import SeparateBehaviour from '../../components/steering/SeparateBehaviour.js';

export default function createclyde() {
  let e = new Entity({ name: 'clyde' });

  e.pos.x = random(610, 800);
  e.pos.y = random(610, 800);

  let anims = Assets.get('pac_anim');
  let atlas = Assets.get('pac_atlas');

  let swithedAniTime = 0;

  e.updateProxy = function(dt) {
    swithedAniTime += dt;

    if (swithedAniTime < 0.25) {
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

  let followBehaviour = new FollowBehaviour(e, {
    target: 'cursor',
    maxSpeed: 200,
    maxSteering: 4
  });

  let separateBehaviour = new SeparateBehaviour(e, {
    minDistance: 32
  });

  let stayInBoundsBehaviour = new StayInBoundsBehaviour(e, {
    steerMag: 110,
    maxSpeed: 150,
    bounds: { x: 32, y: 32, w: scene.gameWidth - 64, h: scene.gameHeight - 64 }
  });

  
  e.addComponent(spriteRenderAni);

  e.addComponent(followBehaviour);
  e.addComponent(separateBehaviour);
  e.addComponent(stayInBoundsBehaviour);

  return e;
}