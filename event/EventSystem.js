'use strict';

let instance = null;

import Utils from '../Utils.js';

export default class EventSystem {
  constructor() {
    if (instance === null) {
      instance = this;

      this.listeners = {};
      this.onlyOnceEvents = new Map();
    }

    return instance;
  }

  arrToKey(arr) {
    return arr.sort().join(':');
  }

  listenerListEmpty(evtName) {
    return typeof this.listeners[evtName] === 'undefined';
    // console.warn(`${e.data.name} is not listening to "${evtName}"`);
    // console.warn(`There isn't anything listening to: "${evtName}"`);
    // return;
    // }
  }

  // The collision system doesn't know about how the
  // listeners will consume the data, so it's up to the event
  // system to order the values nicely for the listeners.
  // This makes the logic in the collision listeners much cleaner.
  orderEntities(data, evtObj) {
    if (data.self === evtObj.ctx) { return; }
    [data.other, data.self] = [data.self, data.other];
  }

  // Occurs on the WeaponSwitcher
  eventsAreOffForEntity(ctx) {
    if (!ctx.entity) { return false; }
    return !ctx.entity.eventsOn;
  }

  printDebug() {
    Debug.add('Event System');

    Object.keys(this.listeners).forEach(listener => {
      let list = this.listeners[listener];
      Debug.add(`  ${listener} : ${list.size} `);
    });

    Debug.add(`onlyOnce entries: ${this.onlyOnceEvents.size}`);
  }

  /*
    Register an event

    returns an id which we can use to turn the event off.
  */
  on(evtName, cb, ctx, cfg) {

    if (this.listenerListEmpty(evtName)) {
      this.listeners[evtName] = new Map();
    }

    let id = Utils.getId();
    this.listeners[evtName].set(id, { cb, ctx, cfg });

    return id;
  }

  fire(e) {
    let evtName = e.evtName;

    if (this.listenerListEmpty(evtName)) { return; }

    let evtObjs = this.listeners[evtName];

    evtObjs.forEach((evtObj, id) => {
      let data = e.data;

      // if(e.data.name === 'mouse'){
      // debugger;  
      // }


      // If there isn't a context, just invoke the callback
      if (!evtObj.ctx) {
        evtObj.cb(data);
        return;
      }

      if (this.eventsAreOffForEntity(evtObj.ctx)) { return; }

      this.orderEntities(data, evtObj);

      if (evtObj.cfg) {
        let cfg = evtObj.cfg;

        if (cfg.onlySelf) {
          // TODO: shouldn't we be checking for ctx === 'self'??
          let res = Object.values(data).filter(v => v === evtObj.ctx);

          // TODO: clean this up.
          if (res.length === 0 && data !== evtObj.ctx) {
            return;
          }
        }

        if (cfg.onlyOnce) {
          let key = this.arrToKey(cfg.onlyOnce(data));
          if (this.onlyOnceEvents.has(key)) { return; }
          this.onlyOnceEvents.set(key, id);
        }
      }

      evtObj.cb.call(evtObj.ctx, data);
    });
  }

  /*
    This method is a bit aggressive in that it doesn't 
    check if the id is associated with an onlyOnce event.
    But since events are unique, this shouldn't be a problem(?)
  */
  removeFromOnlyOnce(searchId) {
    this.onlyOnceEvents.forEach(function(id, key, m) {
      if (searchId === id) {
        m.delete(key);
      }
    });
  }

  /*
   */
  off(id) {
    let res = false;
    let eventNames = Object.values(this.listeners);

    eventNames.forEach(li => {
      if (li.has(id)) {
        res = li.delete(id);
      }
    });

    this.removeFromOnlyOnce(id);
    return res;
  }

  clear() {
    // be super careful when calling this!
    /*jshint -W087 */
    debugger;
    this.listeners = {};
  }
}