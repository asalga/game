import Vec2 from '../math/Vec2.js';
import Event from '../event/Event.js';
import Debug from '../debug/Debug.js';
import Utils from '../Utils.js';

let isOn = true;
let list = [];
let firstTime = true;
let checks = 0;
let debugChecks = [];
let _v = Vec2.create();

export default class CollisionSystem {

  static gatherCollidables() {
    // debugger;
    if (!isOn) { return; }

    // if no object were added or removed, we can avoid doing this work
    if (firstTime || scene.entitiesAddedOrRemovedDirty) {
      firstTime = false;
      Utils.clearArray(list);

      scene.entities.forEach(e => {
        if (e.collidable) { list.push(e); }

        e.children.forEach(ch => {
          if (ch.collidable) {
            list.push(ch);
          }
        });
      });

      // TODO: shouldn't this be done sooner?
      // list = list.filter(e => e.collidable);
      scene.clearFlags();
    }
  }

  // circle_Circle
  // circle_AABB
  // circle_lineSegment

  // AABB_AABB
  // AABB_lineSegment

  // lineSegment_lineSegment

  /*
    TODO: this should be more generic.
  */
  static circleCircleTest(e1, e2) {
    let radTotal = e1.bounds.radius + e2.bounds.radius;
    _v.set(e1.worldCoords);
    Vec2.subSelf(_v, e2.worldCoords);
    return _v.length() <= radTotal;
  }

  static setOn(b) {
    isOn = b;
  }

  static checkCollisions() {

    if (!isOn) { return; }

    checks = 0;

    if (window.debug) {
      Utils.clearArray(debugChecks);
    }

    let e1, e2;

    list.forEach(obj => obj.updateWorldCoords());

    for (let i = 0; i < list.length; ++i) {
      for (let j = i + 1; j < list.length; ++j) {

        e1 = list[i];
        e2 = list[j];

        if (!e1.collidable.enabled || !e2.collidable.enabled) {
          continue;
        }

        let typeA = e1.collidable.type;
        let maskB = e2.collidable.mask;

        let maskA = e1.collidable.mask;
        let typeB = e2.collidable.type;

        if ((typeA & maskB) !== 0 && (typeB & maskA) !== 0) {
          // debugChecks.push(`${e1.name} <-> ${e2.name}`);

          if (CollisionSystem.circleCircleTest(e1, e2)) {

            let e = new Event({
              evtName: 'collision',
              data: { self: e1, other: e2 }
            });
            e.fire();

          }
          checks++;
        }
      }
    }

    Debug.add(`Collision Checks: ${checks}`);
    if (window.debug) {
      debugChecks.forEach(s => {
        Debug.add(debugChecks);
      });
    }

  }
}
// for (let i = 0; i < list.length; ++i) {
// let obj = list[i];
// obj.updateWorldCoords();
// _compCoords.zero();
// ch.getWorldCoords(_compCoords);
// ch._collisionTransform.set(_compCoords);
// }