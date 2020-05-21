import Rectangle from './Rectangle.js';
import Utils from '../Utils.js';

const MAX_DEPTH = 5;

let nodeColors = [{ r: 255, g: 0, b: 0 }, { r: 0, g: 255, b: 0 }, { r: 0, g: 0, b: 255 }];

/*

*/

export default class QuadTree {

  /*
  	cfg: w, h, depth

  	depth is 1-index-based.
  */
  constructor(cfg) {
    Object.assign(this, cfg);

    this.x = cfg.x || 0;
    this.y = cfg.y || 0;
    this.bounds = new Rectangle({ x: this.x, y: this.y, w: this.w, h: this.h });

    this.numIntersectionsThisFrame = 0;

    this.isLeaf = false;
    this.children = [];

    // called from within the QuadTree
    if (this.parent) {
      this.nodeLevel = cfg.currDepth;
      // console.log(this.nodeLevel, this.name);

      this.depth = this.parent.depth;
      this.subdivide(this, cfg.currDepth);
    }
    // called outside QuadTree
    else {
      this.parent = null;
      this.nodeLevel = 1;

      if (this.depth === 1) {
      	this.isLeaf = true;
      }
      //
      else {
        this.subdivide(this, 1);
      }
    }

    // data
    this.entities = [];
  }

  /*
  	Find which leaf node the given point resides in

  	returns null if outside the quadtree
  */
  getLeafFromPoint(p) {
    if (Utils.isPointInsideRect(p, this.bounds)) {

      if (this.isLeaf) return this;

      // Find the intersecting node
      for (let i = 0; i < this.children.length; ++i) {
        let found = this.children[i].getLeafFromPoint(p);
        if (found) {
          return found;
        }
      }
    }

    return null;
  }

  /*
	b {Object} [in]
  */
  getBounds(b) {
    Object.assign(b, { x: this.x, y: this.y, w: this.w, h: this.h });
  }

  /*
   */
  subdivide(parent, currDepth) {
    if (currDepth === MAX_DEPTH || parent.depth === currDepth) return;

    let { x, y, w, h } = parent;

    let cd = currDepth + 1;

    // compass coords
    let ne = new QuadTree({ name: 'NE', x: x + w / 2, y: y, w: w / 2, h: h / 2, currDepth: cd, parent: this });
    let nw = new QuadTree({ name: 'NW', x: x, y: y, w: w / 2, h: h / 2, currDepth: cd, parent: this });
    let sw = new QuadTree({ name: 'SW', x: x, y: y + h / 2, w: w / 2, h: h / 2, currDepth: cd, parent: this });
    let se = new QuadTree({ name: 'SE', x: x + w / 2, y: y + h / 2, w: w / 2, h: h / 2, currDepth: cd, parent: this });

    if (currDepth + 1 === parent.depth) {
      nw.isLeaf = ne.isLeaf = se.isLeaf = sw.isLeaf = true;
    }

    this.children.push(ne, nw, sw, se);
  }

  /*
   */
  insert(e) {
    // Already inside quadrant
    if (this.entities.indexOf(e) > -1) { return false; }

    //
    if (Utils.isCircleIntersectingRect(e, this.bounds)) {

      if (this.isLeaf) {
        this.entities.push(e);
      }
      // 
      else {
        this.children.forEach(c => c.insert(e));
      }
      return true;
    }

    return false;
  }

  /*
   */
  update(dt) {
    if (this.isLeaf) {
      this.entities.forEach(e => e.update(dt));

      let s1, s2;

      // sprite/sprite intersections
      for (let i = 0; i < this.entities.length; i++) {
        for (let j = i + 1; j < this.entities.length; j++) {
          s1 = this.entities[i];
          s2 = this.entities[j];

          if (Utils.isCircleIntersectingCircle(s1, s2)) {
            s2.intersecting = true;
            s1.intersecting = true;
          }
        }
      }

    } else {
      this.children.forEach(c => c.update(dt));
    }
  }

  clear() {
    this.entities.length = 0;

    if (!this.isLeaf) {
      this.children.forEach(c => c.clear());
    }
  }

  debugDraw() {
    if (this.isLeaf === false) {
      this.children.forEach(c => c.debugDraw());
    }
    // strokeWeight((this.nodeLevel % 3) + 1);

    let col = nodeColors[(this.nodeLevel - 1) % 3];
    stroke(col.r, col.g, col.b);
    noFill();
    rect(this.x, this.y, this.w - 2, this.h - 2);


    // noStroke();
    // fill(col.r, col.g, col.b, 40);
    // rect(this.x, this.y, this.w - 2, this.h - 2);
    // textSize(20);
    // text(this.entities.length, this.x, this.y);
  }

  /*
   */
  draw() {
    if (this.isLeaf) {
      this.entities.forEach(e => e.draw());
    } else {
      this.children.forEach(c => c.draw());
    }
  }
}



/*
 * Calling contains() is the slowest O(n) part of running time
 */
// class QuadTree {

//   class Node {
//     int x, y, w, h;
//     int level;

//     boolean isLeaf;
//     Node northEast, northWest, southEast, southWest;

//     ArrayList < Sprite > sprites = new ArrayList < Sprite > ();
//     ArrayList toRemove = new ArrayList < Sprite > ();

//     Node parent;
//     Rectangle rectangle;

//     Node(int x, int y, int w, int h, int level, Node p) {
//       northEast = northWest = southEast = southWest = null;
//       isLeaf = false;
//       this.level = level;
//       this.x = x;
//       this.y = y;
//       this.w = w;
//       this.h = h;
//       rectangle = new Rectangle(x, y, w, h);
//       parent = p;
//     }

//     /*
//      */
//     void drawDebugLines() {

//       if (debugOn == false) {
//         return;
//       }

//       // draw a rectangle around the canvas to make it
//       // obvious we are dealing with 1 node.
//       if (level == 1) {
//         noFill();
//         stroke(255);
//         rect(0, 0, w - 1, h - 1);
//       }

//       // We are drawing the lines that show the children,
//       // so if this actualy doesn't have children, it dosen't make sense to draw the lines.
//       if (isLeaf == true) {
//         fill(192);
//         textFont(font);
//         if (sprites.size() > 0) {
//           text("" + sprites.size(), x + (w / 2), y + (h / 2));
//         }
//         return;
//       }

//       strokeWeight(depth - level);

//       int opacity = 255 - (level * (255 / MAX_DEPTH));
//       stroke(255, opacity);
//       line(x + (w / 2), y, x + (w / 2), y + h); // verttical lines
//       line(x, y + (h / 2), x + w, y + (h / 2)); // horizontal lines
//     }

//     void clearStates() {
//       if (isLeaf) {
//         for (int i = 0; i < sprites.size(); i++) {
//           sprites.get(i).clearStates();
//         }
//       } else {
//         northEast.clearStates();
//         northWest.clearStates();
//         southWest.clearStates();
//         southEast.clearStates();
//       }
//     }


//     /* Update the sprite positions
//       *
//       If a sprite starts to intersect a node, it means it *
//       is either leaving its current node *
//       In that
//     case, that sprite needs to be inserted into the adjacent nodes
//       *
//       moving updwards up the hierarchy
//     if necessary.*/

//     void update(float delta) {

//       if (isLeaf) {

//         Circle cb;
//         Sprite s;
//         for (int i = 0; i < sprites.size(); i++) {
//           s = sprites.get(i);
//           s.update(delta);
//           cb = s.getCircleBounds();

//           // If the sprite has left the node entirely
//           if (Utils.circleInRect(cb, rectangle) == false && Utils.circleIntersectsRect(cb, rectangle) == false) {
//             // prevent rare case exception when sprite tries to leave the root quadrant
//             if (parent != null) {
//               parent.addSprite(s, true);
//             }
//             toRemove.add(s);
//             s.decreaseQuadrantCount();
//           } else {
//             //s.isIntersectingNode = true;
//             if (parent != null)
//               parent.addSprite(s, true);
//           }
//         }

//         // Remove any necessary sprites
//         for (int i = 0; i < toRemove.size(); i++) {
//           sprites.remove(toRemove.get(i));
//         }
//         toRemove.clear();

//         Sprite s1, s2;
//         // Test sprite/sprite intersections
//         for (int i = 0; i < sprites.size(); i++) {
//           for (int j = i + 1; j < sprites.size(); j++) {
//             s1 = sprites.get(i);
//             s2 = sprites.get(j);
//             numIntersectionsTests++;

//             if (Utils.circleIntersectsCircle(s1.getCircleBounds(), s2.getCircleBounds())) {
//               s2.isIntersecting = true;
//               s1.isIntersecting = true;
//             }
//           }
//         }
//       } else {
//         northEast.update(delta);
//         northWest.update(delta);
//         southWest.update(delta);
//         southEast.update(delta);
//       }
//     }

//     /*
//      * Change the number of levels the tree has.
//      * If there is only a root node, that's 1 level, not zero.
//      */
//     void setDepth(int d) {
//       // if we're at a leaf node and depth is greater
//       // than our current level,
//       // we have to subdivide and insert

//       // If we're at a leaf and we need to subdivide.
//       if (isLeaf && d > level) {
//         isLeaf = false;
//         subdivide(d);

//         if (sprites != null) {
//           for (int i = 0; i < sprites.size(); i++) {
//             Sprite s = sprites.get(i);
//             s.decreaseQuadrantCount();
//             northEast.addSprite(s, false);
//             northWest.addSprite(s, false);
//             southEast.addSprite(s, false);
//             southWest.addSprite(s, false);
//           }
//           sprites.clear();
//           clearStates();
//         }
//       } else if (isLeaf == false && d > level) {
//         northEast.setDepth(d);
//         northWest.setDepth(d);
//         southEast.setDepth(d);
//         southWest.setDepth(d);
//         clearStates();
//       }

//       // First we need to find the node to merge
//       else if (d <= depth) {
//         // If the level of this node
//         if (d + 1 == level) {
//           merge();
//         } else {
//           northEast.setDepth(d);
//           northWest.setDepth(d);
//           southEast.setDepth(d);
//           southWest.setDepth(d);

//           isLeaf = true;
//           northEast = northWest = southEast = southWest = null;
//         }
//       }
//     }

//     /*
//      * Call this when we reduce the number of levels of the quadtree.
//      * Place all thie children in the current node into the parent.
//      */
//     void merge() {
//       // Base case, place all the sprites into the parent
//       if (isLeaf) {
//         // If we're at a leaf node, we tell the parent
//         // By setting the parent to a leaf node, calling add node
//         // will not try to insert the sprites lower, back into this node
//         //  parent.isLeaf = true;

//         for (int i = 0; i < sprites.size(); i++) {
//           Sprite s = sprites.get(i);
//           s.decreaseQuadrantCount();
//           // Don't call addSprite() since that's used to insert sprites DOWN into the tree.
//           // If the sprite was in two child nodes we run the risk of adding it in twice.
//           if (parent.sprites.contains(s) == false) {
//             s.increaseQuadrantCount();
//             parent.sprites.add(s);
//           }
//         }
//         clearStates();

//         sprites.clear();
//         return;
//       }

//       isLeaf = true;
//       northEast.merge();
//       northWest.merge();
//       southEast.merge();
//       southWest.merge();

//       //
//       for (int i = 0; i < sprites.size(); i++) {
//         Sprite s = sprites.get(i);
//         s.decreaseQuadrantCount();
//         // Don't call addSprite() since that's used to insert sprites down into the tree.
//         // If the sprite was in two child nodes we run the risk of adding it in twice.
//         if (parent.sprites.contains(s) == false) {
//           s.increaseQuadrantCount();
//           parent.sprites.add(s);
//         }
//       }
//       clearStates();

//       sprites.clear();
//       northEast = northWest = southEast = southWest = null;
//     }

//     /*
//      * Subdivide this node into 4 children.
//      */
//     void subdivide(int d) {

//       // If we reached the number of levels the user wanted, we
//       // declare this node to be a leaf and back out.
//       if (d == level) {
//         isLeaf = true;
//         depth = d;
//         sprites = new ArrayList();
//         toRemove = new ArrayList();
//         return;
//       }
//       northEast = new Node(x + w / 2, y, w / 2, h / 2, level + 1, this);
//       northWest = new Node(x, y, w / 2, h / 2, level + 1, this);
//       southWest = new Node(x, y + h / 2, w / 2, h / 2, level + 1, this);
//       southEast = new Node(x + w / 2, y + h / 2, w / 2, h / 2, level + 1, this);

//       northEast.subdivide(d);
//       northWest.subdivide(d);
//       southEast.subdivide(d);
//       southWest.subdivide(d);
//     }
//   }

//   /*
//    */
//   void create(int w, int h, int d) {
//     Utils.QTassert(d > 0, "Invalid Depth");
//     root = new Node(0, 0, w, h, 1, null);
//     root.subdivide(d);
//   }

//   /*
//    * If debug is on, lines showing nodes will be rendered.
//    */
//   void setDebug(boolean isOn) {
//     debugOn = isOn;
//   }

//   void addSprite(Sprite s) {
//     addSprite(s, false);
//   }

//   void addSprite(Sprite s, boolean bubble) {
//     root.addSprite(s, bubble);
//   }

//   int getNumIntersectionTests() {
//     return numIntersectionsTests;
//   }

//   void update(float delta) {
//     numIntersectionsTests = 0;
//     root.update(delta);
//   }

//   void setDepth(int d) {
//     // Ignore wacky values and safe work if the depth won't change.
//     if (d < 0 || d > MAX_DEPTH || depth == d) {
//       return;
//     }

//     root.setDepth(d);
//     depth = d;
//   }

//   void draw() {
//     root.draw();
//     root.drawDebugLines();
//     postRender();
//   }

//   void postRender() {
//     root.clearStates();
//   }
// }



// // /*
// //  */
// //  class Sprite {
// //   protected int id;
// //   protected PVector pos;
// //   protected PVector dir;  
// //   protected Circle circleBounds;
// //   protected int spriteSize;

// //    boolean hasUpdated;
// //    int renderCallCount;
// //    int quadrantCount;
// //    boolean isIntersecting;
// //    boolean isIntersectingNode;

// //    Sprite() {
// //     id = Utils.getNextID();
// //     pos = new PVector();
// //     dir = new PVector();
// //     circleBounds = new Circle();
// //     clearStates();
// //   }

// //    void increaseQuadrantCount() {
// //     quadrantCount++;
// //   }

// //    void decreaseQuadrantCount() {
// //     quadrantCount--;
// //   }

// //    void clearStates() {
// //     hasUpdated = false;
// //     renderCallCount = 0;

// //     isIntersecting = false;
// //     isIntersectingNode = false;
// //   }
// // }