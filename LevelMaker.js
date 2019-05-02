class LevelMaker {
    constructor() {

    }
    make(map) {
        // Get layers and specifically find the terrain layer
        const layers = map.layers;
        const objLayers = map.objects;
        const terrain = layers.find(findWithProperty, { name: 'name', value: 'terrain' });
        const units = objLayers.find(findWithProperty, { name: 'name', value: 'units' });
        // Loop through the columns and rows of every tile on the map
        terrain.data.forEach(doubleForEach, { func: this.onTerrainTile, scope: this });
        // Loop through all units in the game
        units.objects.forEach(this.onUnit, this);
    }
    onTerrainTile(tile) {
        // Only run code if tile exists
        if (tile.index == -1) return;
        switch (tile.index) {
            case 5:
                game.scene.keys.default.playfield.addWater(tile);
                break;
            default:
                game.scene.keys.default.playfield.addTile(tile);
                break;
        }
    }
    onUnit(unit) {
        game.scene.keys.default.playfield.addUnit(unit);
    }
}