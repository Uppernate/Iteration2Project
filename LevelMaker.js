class LevelMaker {
    constructor() {

    }
    make(map) {
        // Get layers and specifically find the terrain layer
        const layers = map.layers;
        const terrain = layers.find(function (l) { return l.name === 'terrain' });
        // Loop through the columns and rows of every tile on the map
        terrain.data.forEach(function (entry) {
            entry.forEach(this.onTerrainTile, this);
        }, this);
    }
    onTerrainTile(tile) {
        // Only run code if tile exists
        if (tile.index !== -1 && tile.index != 5) {
            game.scene.keys.default.playfield.add.tile(tile);
        }
        if (tile.index == 5) {
            game.scene.keys.default.playfield.add.water(tile);
        }
    }
}