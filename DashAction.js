// JavaScript source code
class DashAction extends BaseAction {
    constructor(unit, config) {
        super(unit);
        config = config || {};
        this.icon = 'dash';
        this.selectType = 'move';
        this.range = 1.6 * (config.range || 1);
        this.stamina = 0.5 * (config.staminaCost || 1);
        this.duration = 0.05 * (config.timeCost || 1);
        this.distanceCost = 1 * (config.staminaCost || 1);
        this.distanceTime = 0.13 * (config.timeCost || 1);
    }
    clicked() {
        if (this.unit.staminaleft >= this.stamina) {
            const tiles = this.selectTilesByMove();
            // TODO: Add stamina/time checks here
            if (tiles.length > 0) {
                this.switchContextAndPass('select-tiles', { tiles: tiles, select: this.selectType });
                this.defaultListen();
            }
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
        const queue = { reference: this.getReference(tile), tile: tile, type: 'moveTo' };
        queue.path = this.getPath(queue.reference);
        queue.time = this.calculateTime(queue.reference);
        queue.stamina = this.calculateStamina(queue.reference);
        const bar = this.unit.addActionToQueue(this, queue);
        bar.displayPath();
        // Playfield Management
        this.showEverything();
    }
    fail() {
        this.switchContextAndPass('none', {});
        this.defaultDeafen();
        this.showEverything();
    }
    begin(bar) {
        // TODO: Start animations, etc.
        // Get measurements for how long one tile should take in time
        bar.tDuration = 1 / (bar.path.length - 1);
        this.unit.stamina.value -= this.stamina;
        bar.stamina -= this.stamina;
    }
    progress(bar, progress) {
        if (!bar.stopped) {
            const modifiedProgress = Math.sin(progress * Math.PI * 0.5);

            const tiles = {
                current: bar.path[0],
                next: bar.path[1],
                under: bar.path[Math.round(modifiedProgress)]
            }

            this.interpolatePosition(tiles.current, tiles.next, modifiedProgress);
            const pathUnitBlocked = this.isPathUnitBlocked(bar.path, tiles.next, true);

            if (tiles.next && pathUnitBlocked &&
                tiles.next.unit !== this.unit.tile) {
                bar.stopped = true;
                bar.lastOffset = progress;
                bar.fromTile = tiles.next;
                bar.lastTile = tiles.current;
                this.unit.stamina.value -= progress * this.distanceCost * bar.reference.distance;
                bar.fromPosition = this.unit.position.copy();
                //this.unit.clearQueue();
            }
            // Move if it isn't
            if (!pathUnitBlocked) {
                this.moveUnitToTile(tiles.under);
            }
        }
        else {
            const tileProgress = Math.min((progress / bar.tDuration - bar.lastOffset) / (1 - bar.lastOffset), 1);
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
        else {
            this.unit.stamina.value -= this.distanceCost * bar.reference.distance;
            bar.stamina = 0;
        }
    }
}