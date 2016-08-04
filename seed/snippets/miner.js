function solve (map, start, exit) {
  if (!map[start.x][start.y]) {
    throw 'invalid: start begins on false tile';
  }
  if (start.x === exit.x && start.y === exit.y) {
    return [];
  }

  var beginNode = new Node(start.x, start.y, null);
  beginNode.getAdjacentNodes();

  var frontier = beginNode.childrenNodes;
  var path = null;

  for (var x = 0; x < (map.length * map[0].length), path === null; x++) {
    frontier.forEach(function (node, index) {
      frontier.splice(index, 1);

      if (node.x === exit.x && node.y === exit.y) {
        path = node.getPath();
      }

      node.getAdjacentNodes();

      if (node.childrenNodes.length > 0) {
        node.childrenNodes.forEach(function (n) {
          frontier.push(n);
        });
      }
    });
  }

  return path;
}