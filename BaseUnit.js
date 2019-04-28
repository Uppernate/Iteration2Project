// JavaScript source code
class BaseUnit {
    constructor() {
        this.health = new Counter(0, 1, 1);
        this.stamina = new Counter(0, 5, 5);
        this.position = new Vector2(0, 0);
        this.name = 'archer';
        this._z = 0;
        this.actions = [];
        this.buffs = [];
        this.queue = [];
        this.sprite = game.scene.keys.default.physics.add.sprite(this.position.x, this.position.y, 'unit');
        this.sprite.depth = depth.get('unit', this.y);
    }
    get timeleft() {
        let seconds = game.scene.keys.default.playfield.secondsPerTurn;
        if (this.queue.length > 0) {
            seconds -= this.queue[this.queue.length - 1].position + this.queue[this.queue.length - 1].duration;
        }
        return seconds;
    }
    idle(start) {
        if (start)
            this.sprite.anims.play(this.getAnimation('idle'), false, this.getRandomFrame('idle'));
        else
            this.sprite.anims.play(this.getAnimation('idle'));
    }
    getRandomFrame(name) {
        return Math.floor(Math.random() * this.getAnimation(name).frames.length);
    }
    getAnimation(name) {
        return game.scene.keys.default.animationManager.getUnitAnim(this.name, name);
    }
    get x() {
        return this.position.x;
    }
    get y() {
        return this.position.y;
    }
    get z() {
        return this._z;
    }
    set x(a) {
        this.position.x = a;
        this.sprite.x = this.position.x;
    }
    set y(a) {
        this.position.y = a;
        this.sprite.depth = depth.get('unit', this.y);
        this.sprite.y = this.position.y + this._z;
    }
    set z(a) {
        this._z = z;
        this.sprite.depth = depth.get('unit', this.y);
        this.sprite.y = this.position.y + this._z;
    }
    damage() {

    }
    death() {

    }
    addActionToQueue(action, time, tile, path) {
        console.log('addActionToQueue()');
        const bar = new BaseQueueBar();
        bar.action = action;
        bar.duration = time;
        bar.tile = tile;
        bar.path = path;
        bar.icon.setTexture(`action-${action.icon}`);
        bar.bar.setTint(action.colour);
        if (this.queue.length > 0) {
            // Place new action on the right of the last action
            bar.position = this.queue[this.queue.length - 1].position + this.queue[this.queue.length - 1].duration;
        }
        else {
            // If no actions, default to 0
            bar.position = 0;
        }
        this.queue.push(bar);
    }
}