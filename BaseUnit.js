// JavaScript source code
class BaseUnit {
    constructor() {
        this.health = new Counter(0, 1, 1);
        this.stamina = new Counter(0, 1, 1);
        this.position = new Vector2(0, 0);
        this.name = 'archer';
        this._z = 0;
        this.actions = [];
        this.buffs = [];
        this.queue = [];
        this.sprite = game.scene.keys.default.physics.add.sprite(this.position.x, this.position.y, 'unit');
        this.sprite.depth = depth.get('unit', this.y);
        this.sprite.anims.play(this.getAnimation('idle'), false, this.getRandomFrame('idle'));
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
}