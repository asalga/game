'use strict';

// const Howler = require('Howler');
// const Howl = require('Howler').Howl;

import Atlas from './Atlas.js';
import Level from '../Level.js';
import Tileset from './Tileset.js';

let cbCalled = false;
let cb = function() {};

let assetTypes = {
  'image': {},
  'atlas': {},
  'tilesets': {},
  'animations': {},
  'audio': {},
  'json': {},
  'shaders': {},
  'levels': {}
};

let numAssetsLoaded = 0;
let totalAssetsToLoad = 0;

function logProgress() {
  console.log(`--> Asset preload progress: ${numAssetsLoaded}/${totalAssetsToLoad}`);
}

function increaseProgress(msg) {
  numAssetsLoaded++;
  console.log(msg);
  logProgress();
  Assets.isDone();
}

function loadImagePromise(url) {
  return new Promise((resolve, reject) => {
    let img = new Image();
    img.addEventListener('load', () => {
      resolve(img);
    });
    img.src = url;
  });
}

/*

*/
export default class Assets {

  static load(manifest, loadingDone) {

    cb = loadingDone;

    // Count how many we need to load so we can compare as we load the assets
    let assetsToLoad = Object.values(manifest);
    assetsToLoad.forEach(assetType => {
      totalAssetsToLoad += assetType.length;
    });

    //
    // ** IMAGES **
    //
    if (manifest.images) {
      manifest.images.forEach(v => {
        loadImage(v.path, p5img => {
          // that.images[v] = p5img;

          assetTypes['image'][v.name] = p5img;

          let msg = `Asset: loaded image: ${v.path}`;
          increaseProgress(msg);
        });
      });
    }

    //
    // ** ANIMATION
    //
    if (manifest.animations) {
      manifest.animations.forEach(j => {
        let n = j.name;

        fetch(j.path)
          .then(function(response) {
            return response.json().then(data => {
              return {
                n: j.name,
                animations: data
              }
            });
          })
          .then(function(data) {

            assetTypes['animations'][data.n] = data.animations;

            let msg = `Asset: loaded animation: ${j.name}`;
            increaseProgress(msg);
          });
      });
    }

    //
    // ** ATLASES
    //
    if (manifest.atlases) {
      manifest.atlases.forEach(a => {

        loadImage(a.imgPath, function(atlasImg) {
          // Once the image is loaded, get the meta file
          let xhr = new XMLHttpRequest();
          xhr.onload = function() {
            let atlas = new Atlas({
              name: a.name,
              p5Img: atlasImg,
              meta: xhr.responseText
            });

            assetTypes['atlas'][a.name] = atlas;

            increaseProgress(`Asset: loaded image: ${a.name}`);
          };
          xhr.open('GET', a.metaPath);
          xhr.send();
        });
      });
    }

    //
    // ** GENERIC GAME SPECIFIC JSON
    //
    if (manifest.json) {
      manifest.json.forEach(j => {
        let n = j.name;

        fetch(j.path)
          .then(function(response) {
            return response.json().then(data => {
              return {
                n: j.name,
                json: data
              }
            });
          })
          .then(function(data) {
            numAssetsLoaded++;
            assetTypes['json'][data.n] = data.json;

            let msg = `Asset: loaded json: ${j.name}`;
            increaseProgress(msg);
          });
      });
    }

    //
    // ** LEVELS
    //
    if (manifest.levels) {
      manifest.levels.forEach(l => {
        let name = l.name;

        console.log('name', name);

        fetch(l.path)
          .then(res => {
            return res.json().then(data => new Level(l.name, data))
          })
          .then(level => {
            assetTypes['levels'][level.name] = level;
            increaseProgress(`Asset: loaded level: ${level.name}`);
          })

      });
    }

    //
    // ** TILESETS
    //
    if (manifest.tilesets) {
      manifest.tilesets.forEach(ts => {
        let name = ts.name;

        Promise.all([
            fetch(ts.path),
            loadImagePromise(ts.image)
          ])
          .then(function(promises) {
            promises[0].json().then(function(meta) {
              assetTypes['tilesets'][name] = new Tileset(meta, promises[1]);
              increaseProgress(`Asset: loaded tileset: ${ts.path}`);
            });
          });
      });
    }

    //
    // ** SHADERS
    //
    if (manifest.shaders) {
      manifest.shaders.forEach(j => {
        let n = j.name;

        let v = fetch(j.vert)
          .then(function(res) {
            return res.text().then(function(shaderSource) {
              return { name: n, src: shaderSource };
            })
          });

        let f = fetch(j.frag)
          .then(function(res) {
            return res.text().then(function(shaderSource) {
              return { name: n, src: shaderSource };
            })
          });

        Promise.all([v, f]).then(function(shaders) {
          let n = shaders[0].name;
          assetTypes['shaders'][n] = {
            vert: shaders[0].src,
            frag: shaders[1].src
          };

          let msg = `Asset: loaded shader: n`;
          increaseProgress(msg);
        });
      });
    }

    //
    // ** AUDIO
    //
    manifest.audio.forEach(v => {
      let that = this;

      let h = new Howl({
        src: v.path,
        volume: 1,
        loop: false,
        autoplay: false,
        onload: _v => {
          increaseProgress(`Asset: loaded audio: ${v.name}`);
          assetTypes['audio'][v.name] = h;
        }
      });

      // that.audio[v.path] = h;

    });
  }

  /*
    
   */
  static get(...args) {

    if (args.length === 1) {
      let assetName = args[0];

      let assetKeys = Object.keys(assetTypes);

      for (let i = 0; i < assetKeys.length; i++) {
        let type = assetKeys[i];

        if (assetTypes[type][assetName]) {
          return assetTypes[type][assetName];
        }
      }
      console.error('Did not find asset:', assetName);
    }

    if (args.length === 2) {
      let type = args[0];
      let key = args[1];
      return assetTypes[type][key];
    }
  };

  /*
   */
  static isDone() {

    if (numAssetsLoaded === totalAssetsToLoad && cbCalled === false) {
      cbCalled = true;
      cb();
    }

    return numAssetsLoaded === totalAssetsToLoad;
  };
}