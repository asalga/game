'use strict';

// import ls from './actors/LetterSelector.js';
// import background from './actors/decorations/Background.js';

let createFuncs = new Map([
  // ['empty', empty]
]);

export default class gfEntityFactory {
  static create(str, args) {
    return createFuncs.get(str)(args);
  }
}