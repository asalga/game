'use strict';

import EventSystem from '../../event/EventSystem.js';

export default class Component {
  constructor(e, name) {
    this.entity = e;
    this.name = name;
    this.tags = [];
  }

  update(dt) {
    this.updateProxy && this.updateProxy(dt);
  }

  // on(evtName, func, ctx) {
  // this.eventFilter(evtName, func, ctx);
  // (new EventSystem()).on(evtName, function() {
  //   if (this.eventsOn === false) { return; }
  //   func.call(this, arguments[0], arguments[1], arguments[2]);
  // }.bind(this), ctx);
  // }

  on(evtName, func, ctx) {
    (new EventSystem()).on(evtName, func, ctx);
  }

  free(){
    console.log('super free called');
  }

  // call after creation 
  init(){
    // console.log('super init called');
  }

  setEvents(b) {
    this.eventsOn = b;
  }

  /*
    v {Vec2} - out
  */
  getWorldCoords(v){
    this.entity.getWorldCoords(v);
    // return this.entity.getWorldCoords();
  }

  /*
    When the associated entity is removed from the scene,
    we give the component a chance to do any cleanup such
    as removing event listeners
  */
  indicateRemove() {}
}