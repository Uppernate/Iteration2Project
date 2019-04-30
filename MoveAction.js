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
    }
    clicked() {
        const tiles = this.selectTilesByMove();
        // TODO: Add stamina/time checks here
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
    begin(bar) {
        // TODO: Start animations, etc.
    }
    progress(bar, progress) {
        if (!bar.stopped) {
            // Get measurements for how long one tile should take in time
            const tileDuration = 1 / (bar.path.length - 1);
            const tileProgress = (progress / tileDuration) % 1;
            // Current, next and rounded 'Where unit is standing on' tiles
            const currentTile = bar.path[Math.floor(progress / tileDuration)];
            let nextTile = bar.path[Math.floor(progress / tileDuration) + 1];
            const underneathTile = bar.path[Math.round(progress / tileDuration)];
            // Replace next with current if there is no next tile
            if (!nextTile)
                nextTile = currentTile;
            // Interpolate positions from current to next by progress
            this.interpolatePosition(currentTile, nextTile, tileProgress);
            // Check if next blocks are blocked by units
            const pathUnitBlocked = this.isPathUnitBlocked(bar.path, nextTile, true);
            // Stop if it is
            if (nextTile && pathUnitBlocked &&
                nextTile.unit !== this.unit.tile) {
                bar.stopped = true;
                bar.lastOffset = tileProgress;
                bar.lastIndex = Math.floor(progress / tileDuration);
                bar.fromTile = nextTile;
                bar.lastTile = currentTile;
                bar.fromPosition = this.unit.position.copy();
                //this.unit.clearQueue();
            }
            // Move if it isn't
            if (!pathUnitBlocked) {
                this.moveUnitToTile(underneathTile);
            }
        }
        else {
            // Get measurements for how long one tile should take in time
            const tileDuration = 1 / (bar.path.length - 1);
            //const tileProgress = 1 - ((progress / tileDuration) % 1);
            const tileProgress = Math.min((progress / tileDuration - bar.lastIndex - bar.lastOffset) / (1 - bar.lastOffset), 1);
            const lastTile = new Vector2(bar.lastTile.x * 16 - bar.lastTile.y * 16, bar.lastTile.x * 8 + bar.lastTile.y * 8 - 16 - 2);

            this.unit.position.set(bar.fromPosition).lerp(lastTile, tileProgress);
            this.unit.x = this.unit.position.x;
            this.unit.y = this.unit.position.y;
        }
    }
    end(bar) {
        if (bar.stopped) {
            this.unit.clearQueue();
        }
    }
}