'use strict';

import Utils from '../Utils.js';

export default class PriorityQueue {
  constructor() {
    this.items = [];
  }

  clear(){
    Utils.clearArray(this.items);
  }

  size(){
    return this.items.length;
  }

  enqueue(obj, priority) {
    let contains = false;
    let item = { obj, priority };

    for (let i = 0, len = this.items.length; i < len; ++i) {
      if (this.items[i].priority > item.priority) {
        this.items.splice(i, 0, item);
        contains = true;
        break;
      }
    }

    if (contains === false) {
      this.items.push(item);
    }
  }

  printPQueue() {
    var str = '';
    for (var i = 0; i < this.items.length; i++){
      str += this.items[i].obj + ' ';
    }
    return str;
  }
  
  isEmpty() {
    return this.items.length === 0;
  }

  dequeue() {
    return this.items.shift().obj;
  }
}