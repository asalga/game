/*
	The purpose of a Level is to instantiate 
*/

class EntityIterator {
  constructor(level) {
    this.idx = 0;
    this.level = level;
  }

  next() {
    if (this.idx === this.level.data.layers[0].data.length) {
      return null;
    }

    let obj = this.level.data.layers[0].data[this.idx];

    this.idx++;
    return obj;
  }
}

export default class Level {

  constructor(name, data) {
    this.name = name;
    this.data = data;
  }

  getEntityIterator() {
    return new EntityIterator(this);
  }
}