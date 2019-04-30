// JavaScript source code
class DashAction extends BaseAction {
    constructor(unit) {
        super(unit);
        this.icon = 'dash';
        this.range = 1.6;
        this.stamina = 1.4;
        this.duration = 0.05;
        this.distanceCost = 2.5;
        this.distanceTime = 0.1;
    }
    clicked() {
        const tiles = this.selectTilesByMove();
        // Todo: Time/Stamina Check
        if (tiles.length > 0) {
            this.switchContextAndPass('select-tiles', { tiles: tiles });
            this.defaultListen();
        }
    }
    cancel() {
        this.fail();
    }
    success(tile) {
        // State Management
        this.switchContextAndPass('none', {});
        this.defaultDeafen();
        // Path of movement
        const reference = this.latestChecked.find(a => a.original === tile);
        const path = this.makePathFrom(reference);
        const totalTime = this.duration + this.distanceTime * reference.distance;
        const bar = this.unit.addActionToQueue(this, totalTime, tile, path, 'moveTo');
        bar.displayPath();
        // Playfield Management
        game.scene.keys.default.playfield.showUnits();
        game.scene.keys.default.playfield.showTiles();
    }
    fail() {
        this.switchContextAndPass('none', {});
        this.defaultDeafen();
        game.scene.keys.default.playfield.showUnits();
        game.scene.keys.default.playfield.showTiles();
    }
}