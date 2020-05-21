'use strict';

import Assets from '../../../assets/Assets.js';
import Entity from '../../Entity.js';

import SpriteRenderAni from '../../components/SpriteRenderAnimation.js';
import SpriteAniDynamic from '../../components/SpriteAniDynamic.js';
import FollowBehaviour from '../../components/steering/FollowBehaviour.js';
import StayInBoundsBehaviour from '../../components/steering/StayInBoundsBehaviour.js';
import SeparateBehaviour from '../../components/steering/SeparateBehaviour.js';

export default function createBlinky() {
  let e = new Entity({ name: 'blinky' });

  // e.pos.x = random(-20, 600);
  // e.pos.y = random(-50, 600);
  [e.pos.x, e.pos.y] = [random(200,300), 200];


  let anims = Assets.get('pac_anim');
  let atlas = Assets.get('pac_atlas');

  let swithedAniTime = 0;

  e.updateProxy = function(dt) {
    swithedAniTime += dt;

    if (swithedAniTime < 0.25) {
      return;
    }
    if (this.vel.x > 0) {
      spriteRenderAni.play('blinky_right');
      swithedAniTime = 0;
    } else {
      spriteRenderAni.play('blinky_left');
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
    currAnimation: 'blinky_left',
    autoplay: false
  });

  // let spriteAniDynamic = new SpriteAniDynamic(e, {
  //   layerName: 'sprite',
  //   atlas: atlas,
  //   animations: anims,
  //   currAnimation: 'blinky_left',
  //   autoplay: false
  // });

  let followBehaviour = new FollowBehaviour(e, {
    target: 'cursor',
    maxSpeed: 200,
    maxSteering: 2
  });

  let stayInBoundsBehaviour = new StayInBoundsBehaviour(e, {
    steerMag: 10,
    maxSpeed: 400,
    bounds: { x: 100, y: 100, w:300, h:300 }
    // bounds: { x: 32, y: 32, w: scene.gameWidth - 64, h: scene.gameHeight - 64 }
  });

  let separateBehaviour = new SeparateBehaviour(e, {
    minDistance: 600
  });

  // e.addComponent(separateBehaviour);
  e.addComponent(stayInBoundsBehaviour);
  // e.addComponent(spriteAniDynamic);
  e.addComponent(spriteRenderAni);
  // e.addComponent(followBehaviour);
  
  // e.addComponent(spriteRenderAni);

  return e;
}