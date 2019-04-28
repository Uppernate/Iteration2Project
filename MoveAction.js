// JavaScript source code
class MoveAction extends BaseAction {
    constructor(unit) {
        super(unit);
        this.icon = 'move';
        this.range = 3.6; 
        this.stamina = 0.4;
        this.duration = 0.1;
        this.distanceCost = 0.2;
        this.distanceTime = 0.25;
        this.totalTime = this.duration;
    }
    clicked() {
        console.log('moveaction')
        const tiles = this.selectTilesByMove();
        // TODO: Add stamina/time checks here
        if (tiles.length > 0) {
            const manager = game.scene.keys.default.touchManager;
            manager.clearStorage();
            manager.storage.tiles = tiles;
            manager.switchState('select-tiles');
            manager.on('context-selected', this.success, this);
            manager.on('context-cancel', this.fail, this);
        }
    }
    success(tile) {
        console.log('tile selected, next step');
        console.log(tile);

        // State Management
        const manager = game.scene.keys.default.touchManager;
        manager.clearStorage();
        manager.switchState('none');
        manager.off('context-selected', this.success, this);
        manager.off('context-cancel', this.fail, this);

        // Path of movement
        const reference = this.latestChecked.find(a => a.original === tile);
        const path = this.makePathFrom(reference);
        const totalTime = this.duration + this.distanceTime * reference.distance;
        this.unit.addActionToQueue(this, totalTime, tile, path);

        // Playfield Management
        game.scene.keys.default.playfield.showUnits();
        game.scene.keys.default.playfield.showTiles();
    }
    fail() {
        const manager = game.scene.keys.default.touchManager;
        manager.clearStorage();
        manager.switchState('none');
        manager.off('context-selected', this.success, this);
        manager.off('context-cancel', this.fail, this);
        game.scene.keys.default.playfield.showUnits();
        game.scene.keys.default.playfield.showTiles();
    }
}