// JavaScript source code
class ShootArrowAction extends BaseAction {
    constructor(unit, config) {
        super(unit);
        config = config || {};
        this.icon = 'arrowshoot';
        this.selectType = 'attack';
        this.range = 4 * (config.range || 1);
        this.stamina = 0.6 * (config.staminaCost || 1);
        this.duration = 0.6 * (config.timeCost || 1);
        this.distanceCost = 0;
        this.distanceTime = 0;
        this.damage = 2 * (config.damage || 1);
        this.colour = 0xf44242;
    }
    clicked() {
        const tiles = this.selectTilesBySight();
        // TODO: Add stamina/time checks here
        if (tiles.length > 0) {
            this.switchContextAndPass('select-tiles', { tiles: tiles, select: this.selectType });
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
        queue.damage = this.damage;
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
    }
    progress(bar, progress) {
        if (progress >= 0.5 && !bar.shot) {
            bar.shot = true;
            const tileHit = bar.path[0];
            if (tileHit && tileHit.unit) {
                tileHit.unit.damage(bar.damage);
            }
            this.unit.stamina.value -= this.stamina;
            bar.stamina -= this.stamina;
        }
    }
    end(bar) {
        if (bar.stopped) {
            this.unit.clearQueue();
        }
    }
}