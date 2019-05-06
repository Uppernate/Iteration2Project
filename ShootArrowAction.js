// JavaScript source code
class ShootArrowAction extends BaseAction {
    constructor(unit, config) {
        super(unit);
        config = config || {};
        this.icon = 'arrowshoot';
        this.range = 4 * (config.range || 1);
        this.stamina = 0.2 * (config.staminaCost || 1);
        this.duration = 0.6 * (config.timeCost || 1);
        this.distanceCost = 0;
        this.distanceTime = 0;
        this.colour = 0xf44242;
    }
    clicked() {
        const tiles = this.selectTilesBySight();
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
        const queue = { reference: this.getReference(tile), tile: tile };
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
    }
    progress(bar, progress) {
        if (!bar.stopped) {
            // Get measurements for how long one tile should take in time
            const tileProgress = (progress / bar.tDuration) % 1;
            // Current, next and rounded 'Where unit is standing on' tiles
            const tiles = {
                current: bar.path[Math.floor(progress / bar.tDuration)],
                next: bar.path[Math.floor(progress / bar.tDuration) + 1],
                under: bar.path[Math.round(progress / bar.tDuration)]
            }
            // Replace next with current if there is no next tile
            if (!tiles.next)
                tiles.next = tiles.current;
            // Interpolate positions from current to next by progress
            this.interpolatePosition(tiles.current, tiles.next, tileProgress);
            // Check if next blocks are blocked by units
            const pathUnitBlocked = this.isPathUnitBlocked(bar.path, tiles.next, true);
            // Stop if it is
            if (tiles.next && pathUnitBlocked &&
                tiles.next.unit !== this.unit.tile) {
                bar.stopped = true;
                bar.lastOffset = tileProgress;
                bar.lastIndex = Math.floor(progress / bar.tDuration);
                bar.fromTile = tiles.next;
                bar.lastTile = tiles.current;
                bar.fromPosition = this.unit.position.copy();
                //this.unit.clearQueue();
            }
            // Move if it isn't
            if (!pathUnitBlocked) {
                this.moveUnitToTile(tiles.under);
            }
        }
        else {
            const tileProgress = Math.min((progress / bar.tDuration - bar.lastIndex - bar.lastOffset) / (1 - bar.lastOffset), 1);
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