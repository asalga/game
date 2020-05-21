'use strict';

import Vec2 from '../math/Vec2.js';

import Event from '../event/Event.js';
import EventSystem from '../event/EventSystem.js';

import Utils from '../Utils.js';
import Pool from '../core/Pool.js';

//////
let _temp = Vec2.create();

export default class Entity {
  constructor(cfg) {
    this.cfg = cfg;

    // TODO: fix
    this.speed = 1;
    this.timeScale = 1;
    this.components = [];
    this.children = [];
    this.parent = null;
    this.tags = [];

    this.reset();
  }

  /*
    When we reset an object, we'll also need to generate a new ID
  */
  reset() {

    let defaults = {
      opacity: 1,
      visible: true
    };
    Utils.applyProps(this, defaults, this.cfg);

    this.eventsOn = true;
    this.registeredEvents = [];
    this.rot = 0;

    this.pos = Pool.get('vec2');
    this.vel = Pool.get('vec2');
    this.acc = Pool.get('vec2');
    this.distance = Pool.get('vec2');
    this.worldCoords = Pool.get('vec2');

    this.id = Utils.getId();

    this.children.forEach(ch => {
      ch.reset();
      ch.resetProxy && ch.resetProxy();
    });

    this.components.forEach(c => {
      c.reset();
      c.resetProxy && c.resetProxy()
    });

    //
    this.resetProxy && this.resetProxy();
  }

  setup() {}

  draw() {
    // now taken care of in the Renderer
    // if (!this.visible) { return; }
    p3.save();

    this.renderProxy && this.renderProxy(p3);
    // this.children.forEach(c => c.draw());

    // TODO: fix
    if (this.name === 'bhvrandomselector') debugger;
    this.components.forEach(c => { c.draw && c.draw(); });
    p3.restore();
  }

  // TODO: yup, implement this too
  setPropertyRecursive(name, v) {
    /*jshint -W087 */
    debugger;
  }

  /*
   */
  update(dt) {

    // TODO: replace with assert
    if (Number.isNaN(this.vel.x)) {
      /*jshint -W087 */
      debugger;
    }

    this.updateProxy && this.updateProxy(dt);


    let c;
    for (let i = 0; i < this.components.length; i++) {
      c = this.components[i];
      c.update && c.update(dt, this);
      c.updateProxy && c.updateProxy(dt);
    }

    // this.components.forEach(c => {
    //   // ok if no update method?
    //   // add in entity on creation or update?
    //   c.update && c.update(dt, this);
    //   c.updateProxy && c.updateProxy(dt);
    // });

    // 
    if (this.vel) {
      this.pos.x += this.vel.x * dt * this.timeScale;
      this.pos.y += this.vel.y * dt * this.timeScale;

      // Currently, this is only for animation
      this.distance.x += Math.abs(this.vel.x) * dt;
      this.distance.y += Math.abs(this.vel.y) * dt;
    }

    for (let i = 0, len = this.children.length; i < len; i++) {
      this.children[i].update(dt);
    }
  }

  /*
    c - child entity
  */
  add(c) {
    c.parent = this;
    this.children.push(c);
    new Event({ evtName: 'childaddedtoparent', data: { parent: this, child: c } }).fire();
  }

  /*
    Move node from parent to scene/root
  */
  detachFromParent() {
    scene.add(this);
    this.parent.removeDirectChild(this);
  }

  /*
    Free any resources from Pools.
  */
  free() {
    Pool.free(this.pos);
    Pool.free(this.vel);
    Pool.free(this.acc);
    Pool.free(this.distance);
    Pool.free(this.worldCoords);
  }

  /*
    If a component needs to remove the associated entity,
    give it a method that abstracts out whether the entity
    is in a scenegraph or directly in the scene.
  */
  removeSelf() {
    if (this.parent) {
      this.parent.removeDirectChild(this);
    } else {
      scene.remove(this);
    }
  }

  /*

  */
  removeDirectChild(e) {
    let res = Utils.removeFromArray(this.children, e);
    e.parent = null;
    return res;
  }

  removeChild(e) {
    /*jshint -W087 */
    debugger;
  }

  // TODO: fix
  hasChild(name) {
    let found = false;

    for (let i = 0; i < this.children.length; ++i) {
      if (this.children[i].name === name) {
        return true;
      }

      if (this.children[i].children.length > 0) {
        return this.children.children.hasChild(name);
      }
    }
    return false;
  }

  updateWorldCoords() {
    this.worldCoords.zero();
    this.getWorldCoords(this.worldCoords);
  }

  getRoot() {
    if (this.parent === null) {
      return this;
    }
    return this.parent.getRoot();
  }

  addComponent(c) {
    if (this[c.name]) {
      console.warn(`Warning: ${this.name} already has ${c.name}`);
    }
    this.components.push(c);
    this[c.name] = c;
  }

  removeComponent(c) {
    Utils.removeFromArray(this.components, c);
    this.components[c.name] = undefined;
  }

  removeComponentByName(str) {
    // let c = this.components[str];debugger;

    let c = this.components.find(o => o.name === str);
    if (c) {
      Utils.removeFromArray(this.components, c);
      this[str] = undefined;
      return true;
    }
    return false;
  }

  findComponentByName(str) {
    let c = this.components.find(o => o.name === str);
    return c;
  }

  findComponentsByTagName(str) {
    let arr = [];

    for (let c of this.components) {

      let idx = c.tags.indexOf(str);
      if (idx > -1) {
        arr.push(this.components[idx]);
      }
    }

    return arr;
  }

  findComponentByTagName(str) {

    for (let c of this.components) {

      let idx = c.tags.indexOf(str);

      if (idx > -1) {
        return this.components[idx];
      }

      return null;
    }
  }

  init() {
    this.components.forEach(c => c.init());

    this.children.forEach(e => {
      e.init();

      e.components.forEach(c => {
        c.init();
      });
    });
  }

  getChildrenWithComponentTagName(str) {
    let arr = [];
    this.children.forEach(c => {
      if (c.findComponentByTagName(str)) {
        arr.push(c);
      }
    });
    return arr;
    // debugger;
  }

  setEvents(b) {
    this.eventsOn = b;
  }

  /*
    Zero out the vector prior to calling this method
    v {Vec2} - out
  */
  getWorldCoords(v) {
    if (this.parent) {
      Vec2.addSelf(this.parent.getWorldCoords(v), this.pos);
    } else {
      Vec2.addSelf(v, this.pos);
    }
    return v;
  }

  /*
    Returns the event ID which the calling code can use
    to turn the event off
  */
  on(evtName, cb, ctx, cfg) {
    let id = Events.on(evtName, cb, ctx, cfg);
    this.registeredEvents.push(id);
    return id;
  }

  off(id) {
    Utils.removeFromArray(this.registeredEvents, id);
    Events.off(id);
  }

  /*
    Called once the scene has removed the entity from the scene.
  */
  indicateRemove() {

    if (!this._pool) {
      this.free();
      this.children.forEach(c => c.indicateRemove());
      this.components.forEach(c => c.indicateRemove());

      // don't call off(), since we don't want to modify an
      // array while we iterate over it.
      this.registeredEvents.forEach(id => Events.off(id));
      Utils.clearArray(this.registeredEvents);
    }
    // If this object is memory managed
    else {
      this.free();
      Pool.free(this);
    }
  }
}