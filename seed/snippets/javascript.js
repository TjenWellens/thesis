var map = [[true, true, true, false, true],
  [false, false, true, false, true],
  [true, true, true, true, true],
  [true, false, true, false, false],
  [false, true, true, true, true]];

function solve(map, miner, exit) {
  function Node(x, y, parentNode) {
    this.x = x;
    this.y = y;
    this.childrenNodes = [];
    this.parentNode = parentNode;
    this.directionFromParent = null; //relative to parent

    this.getAdjacentNodes = function() {
      if (this.checkValidChild(this.x, this.y-1)) { this.addChild(x, y-1, 'up'); }
      if (this.checkValidChild(this.x, this.y+1)) { this.addChild(x, y+1, 'down'); }
      if (this.checkValidChild(this.x+1, this.y)) { this.addChild(x+1, y, 'right'); }
      if (this.checkValidChild(this.x-1, this.y)) { this.addChild(x-1, y, 'left'); }
    };

    this.checkValidChild = function(x, y) {
      if (x < 0 || x >= map.length) { return false; }
      if (y < 0 || y >= map[0].length) { return false; }
      if (this.existsInPath(x, y)) { return false; }
      return map[x][y];
    };

    this.addChild = function(x, y, direction) {
      var c = new Node(x, y, this);
      c.directionFromParent = direction;
      this.childrenNodes.push(c);
    };

    this.getPath = function() {
      var path = [this.directionFromParent];
      var currentNode = this.parentNode;

      while (currentNode !== null && currentNode.directionFromParent !== null) {
        path.unshift(currentNode.directionFromParent);
        currentNode = currentNode.parentNode;
      }

      return path;
    };

    this.existsInPath = function(x, y) {
      // go up the tree and see if a node with this x,y exists already
      var currentNode = this.parentNode;

      while (currentNode != null) {
        if (currentNode.x === x && currentNode.y === y) return true;
        currentNode = currentNode.parentNode;
      }

      return false;
    };
  }

  if (!map[miner.x][miner.y]) { throw 'invalid: miner begins on false tile'; }
  if (miner.x === exit.x && miner.y === exit.y) { return []; }

  var beginNode = new Node(miner.x, miner.y, null);
  beginNode.getAdjacentNodes();

  var frontier = beginNode.childrenNodes;
  var path = null;

  for (var x = 0 ; x < (map.length * map[0].length), path === null; x++) {
    frontier.forEach(function(node, index) {
      frontier.splice(index, 1);

      if (node.x === exit.x && node.y === exit.y) {
        console.log('found path!')
        path = node.getPath();
      }

      console.log(node);
      node.getAdjacentNodes();

      if (node.childrenNodes.length > 0) {
        node.childrenNodes.forEach( function(n) {frontier.push(n);});
      }
    });
  }

  return path;
}

console.log(solve(map, {x:0,y:0}, {x:4,y:4}));