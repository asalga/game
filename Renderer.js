'use strict';

import PriorityQueue from './core/PriorityQueue.js';

function createLayer(n,w,h) {
  let cvs = document.createElement('canvas');
  [cvs.width, cvs.height] = [w,h];

  let p = createGraphics(cvs.width, cvs.height);
  return p;
}

// Change the order of these tags to change rendering order
let layerConfig = [
  { name: 'background', cfg: { 'clearFrame': false } },
  { name: 'spriteprops', cfg: { 'clearFrame': true } },
  { name: 'sprite', cfg: { 'clearFrame': true } },
  { name: 'bullet', cfg: { 'clearFrame': true } },
  { name: 'effect', cfg: { 'clearFrame': true } },
  { name: 'ui', cfg: { 'clearFrame': true } },
  { name: 'debug', cfg: { 'clearFrame': true } }
];

let layerMap = new Map();
let layers = [];

export default class Renderer {

  static init(w,h) {
    layerConfig.forEach(obj => {
      let layer = {
        'name': obj.name,
        'p3': createLayer(obj.name,w,h),
        'cfg': obj.cfg,
        'renderables': new PriorityQueue()
      };

      layers.push(layer);
      layerMap.set(obj.name, layer);
    });
  }

  static render(scene) {
    let i, layer;

    // TODO: remove?
    // p3.clear();

    // Place entities in their respective layers
    scene.entities.forEach(e => {

      if (e.visible === false || e.opacity === 0) { return; }

      // TODO: this needs to be recursive!
      // CHILDREN
      // e.children.forEach(e => {
      //   //  e.opacity = rootOpacity;
      //   if (e.components) {
      //     e.components.forEach(c => {

      //       //  c.opacity = rootOpacity;
      //       if (c.renderable && c.visible) {
      //         let layer = layerMap.get(c.layerName);
      //         // Layer may not exist if we are debugging
      //         layer && layer.renderables.enqueue(c, c.zIndex);
      //       }
      //     });
      //   }
      // });


      for (i = 0; i < e.children.length; i++) {
        let e = e.children[i];

        if (e.components) {

          for (let c = 0; c < e.components.length; i++) {
            // e.components.forEach(c => {
            //  c.opacity = rootOpacity;
            if (c.renderable && c.visible) {
              let layer = layerMap.get(c.layerName);
              // Layer may not exist if we are debugging
              layer && layer.renderables.enqueue(c, c.zIndex);
            }
            // });
          }
          // e.components.forEach(c => {

          //   //  c.opacity = rootOpacity;
          //   if (c.renderable && c.visible) {
          //     let layer = layerMap.get(c.layerName);
          //     // Layer may not exist if we are debugging
          //     layer && layer.renderables.enqueue(c, c.zIndex);
          //   }
          // });
        }
      }




      for (let i = 0; i < e.components.length; i++) {
        let c = e.components[i];
        if (c.renderable && c.visible) { // && c.opacity > 0
          // c.opacity = rootOpacity;
          layer = layerMap.get(c.layerName);
          layer && layer.renderables.enqueue(c, c.zIndex);
        }
      }

      // // COMPONENTS
      // e.components.forEach(c => {
      //   if (c.renderable && c.visible) { // && c.opacity > 0
      //     // c.opacity = rootOpacity;
      //     let layer = layerMap.get(c.layerName);
      //     layer && layer.renderables.enqueue(c, c.zIndex);
      //   }
      // });

    });



  // // Draw the entities onto their layers
    for(let i = 0; i < layers.length; i++){
      let _layer = layers[i];
      let _p3 = _layer.p3;

      if (_layer.cfg.clearFrame) {
        // _p3.clearAll(); ???
        _p3.clear();
      }

      let q = _layer.renderables;
      while (q.isEmpty() === false) {
        let c = q.dequeue();
        c.draw(_p3);
      }
    }
    // // Draw the entities onto their layers
    // layers.forEach(_layer => {
    //   let _p3 = _layer.p3;

    //   if (_layer.cfg.clearFrame) {
    //     // _p3.clearAll(); ???
    //     _p3.clear();
    //   }

    //   let q = _layer.renderables;
    //   while (q.isEmpty() === false) {
    //     let c = q.dequeue();
    //     c.draw(_p3);
    //   }
    // });


    // Draw all the layers onto the main canvas
    // layers.forEach(layer => image(layer.p3, 0, 0));
    for (let i = 0; i < layers.length; i++) {
      image(layers[i].p3, 0, 0);
    }
  }

  static preRender() {}
  static postRender() {}
}