function solve (map, start, exit) {
    var frontier = start.getNeighbors();
    var path = null;

    for (var x = 0; x < (map.length * map[0].length), path === null; x++) {
        frontier.forEach(function (tile) {
            frontier.remove(tile);

            if (tile.equals(exit)) {
                path = tile.getPath();
            }

            tile.getNeighbors().forEach(function (neighbor) {
                frontier.push(neighbor);
            });
        });
    }

    return path;
}