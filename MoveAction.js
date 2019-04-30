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
            const tileDuration = 1 / (bar.path.length - 1);
            const currentTile = bar.path[Math.floor(progress / tileDuration)];
            let nextTile = bar.path[Math.floor(progress / tileDuration) + 1];
            let i = Math.floor(progress / tileDuration) + 1;
            if (!nextTile) {
                nextTile = currentTile;
                i--;
            }
            const underneathTile = bar.path[Math.round(progress / tileDuration)];
            const tileProgress = (progress / tileDuration) % 1;

            const currentVector = new Vector2(currentTile.x * 16 - currentTile.y * 16, currentTile.x * 8 + currentTile.y * 8 - 16 - 2);
            const nextVector = new Vector2(nextTile.x * 16 - nextTile.y * 16, nextTile.x * 8 + nextTile.y * 8 - 16 - 2);

            this.unit.position.set(currentVector).lerp(nextVector, tileProgress);

            let clearPath = nextTile;
            let clearBool = true;
            if (clearPath && clearPath.unit && clearPath.unit !== this.unit) {
                clearBool = false;
            }

            while (!clearBool && ++i < bar.path.length) {
                clearPath = bar.path[i];
                if (clearPath && (!clearPath.unit || clearPath.unit === this.unit)) {
                    clearBool = true;
                }
            }
            console.log(clearBool);
            if (nextTile && nextTile.unit !== this.unit.tile && !clearBool) {
                bar.stopped = true;
                this.unit.x = currentTile.x * 16 - currentTile.y * 16;
                this.unit.y = currentTile.x * 8 + currentTile.y * 8 - 16 - 2;
                this.unit.clearQueue();
            }
            if (clearBool && underneathTile !== this.unit.tile) {
                if (!underneathTile.unit) {
                    this.unit.tile.unit = undefined;
                    underneathTile.unit = this.unit;
                    this.unit.tile = underneathTile;
                }
            }

            this.unit.x = this.unit.position.x;
            this.unit.y = this.unit.position.y;
        }
    }
    end(bar) {

    }
}