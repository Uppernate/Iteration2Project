// JavaScript source code
class DashAction extends BaseAction {
    constructor(unit) {
        super(unit);
        this.icon = 'dash';
        this.range = 1.5;
        this.stamina = 0.1;
        this.duration = 0.05;
        this.distanceCost = 2.5;
        this.distanceTime = 0.1;
    }
    clicked() {
        const tiles = this.selectTilesByMove();
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
        const manager = game.scene.keys.default.touchManager;
        manager.clearStorage();
        manager.switchState('none');
        manager.off('context-selected', this.success, this);
        manager.off('context-cancel', this.fail, this);
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