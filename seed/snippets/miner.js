function solve (map, start, exit) {
    if (!map.contains(start) || !map.contains(exit)) {
      return null;
    }
    if (start.equals(exit)) {
        return [];
    }
    var frontier = start.getNeighbors();
    for (var i = 0; i < map.rows * map.cols; i++) {
        for (var j = 0; j < frontier.length; j++) {
            var tile = frontier[j];
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