function solve (map, start, exit) {
    var frontier = start.getNeighbors();

    for (var i = 0; i < map.rows * map.cols; i++) {
        for (var frontierIndex = 0; frontierIndex < frontier.length; frontierIndex++) {
            var tile = frontier[frontierIndex];

            frontier.remove(tile);

            if (tile.equals(exit)) {
                return tile.getPath();
            }

            var neighbors = tile.getNeighbors();
            frontier = frontier.concat(neighbors);
        }
    }

    return null;
}