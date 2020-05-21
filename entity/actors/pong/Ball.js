'use strict';

import Entity from '../../Entity.js';
import SpriteRender from '../../components/SpriteRender.js';
import SpriteRenderAni from '../../components/SpriteRenderAnimation.js';
import BounceBehaviour from '../../components/pong/BounceBehaviour.js';
import Collidable from '../../components/Collidable.js';

import BoundingCircle from '../../../collision/BoundingCircle.js';
import CType from '../../../collision/CollisionType.js';

import Asset from '../../../assets/Assets.js';

export default function createBall() {
  let e = new Entity({ name: 'ball' });

  e.pos.x = 300;
  e.pos.y = 300;

  let rad = 15;
  e.bounds = new BoundingCircle(e.pos, rad);
  let a = new Asset();

  let img = a.get('image', 'node');
  let anims = a.get('animations', 'test');
  let atlas = a.get('atlas', 'pac');

  e.updateProxy = function(dt) {};

  let spriteRenderAni = new SpriteRenderAni(e, {
    layerName: 'sprite',
    atlas: atlas,
    animations: anims,
    animationTime: 1,
    loop: true,
    pingpong: false
  });
  // spriteRenderAni.play('ball');

 //  spriteRenderAni.draw = function(p) {
 //    p.imageMode(CENTER);

	// let frame = anims['ghost_walk'].frames[0].split('.png')[0];
	// let img0 = atlas.get(frame);
	
 //    // console.log(anims, anims['ghost_walk'].frames[0]);
 //    p.image(img0, this.entity.pos.x, this.entity.pos.y);
 //  };

  // let spriteRender = new SpriteRender(e, { layerName: 'sprite' });
  // spriteRender.draw = function(p) {
  //   p.imageMode(CENTER);
  //   p.fill(33, 66, 99);
  //   // p.ellipse(this.entity.pos.x, this.entity.pos.y, rad * 2, rad * 2);
  //   p.image(img, this.entity.pos.x, this.entity.pos.y);
  // };

  let bounceBehaviour = new BounceBehaviour(e, {});

  // e.addComponent(spriteRender);
  e.addComponent(spriteRenderAni);
  e.addComponent(bounceBehaviour);

  return e;
}