function solve (map, start, exit) {
    if (start.equals(exit)) {
        return [];
    }

    var beginNode = new Node(start.x, start.y, null);
    beginNode.getAdjacentNodes();

    var frontier = beginNode.childrenNodes;
    var path = null;

    for (var x = 0; x < (map.length * map[0].length), path === null; x++) {
        frontier.forEach(function (node, index) {
            frontier.splice(index, 1);

            if (node.equals(exit)) {
                path = node.getPath();
            }

            node.getNeighbors().forEach(function (neighbor) {
                frontier.push(neighbor);
            });
        });
    }

    return path;
}