// JavaScript source code
class BaseTile {
    constructor() {
        // Create position property and create a brand new sprite for this tile.
        this.position = new Vector2(0, 0);
        this._z = 0;
        this.walkable = true;
        this.blocksSight = false;
        this.selectable = true;
        this.sprite = game.scene.keys.default.physics.add.sprite(this.position.x, this.position.y, 'terrain');
    }
    // Coordinate getters/setters as shortcuts for position property
    // Setters automatically apply the coordinate change to the sprite
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
        this.sprite.x = this.position.x * 16 - this.position.y * 16;
        this.sprite.y = this.position.x * 8 + this.position.y * 8;
        this.sprite.depth = depth.get('tile', this.sprite.y);
        this.sprite.y = this.position.x * 8 + this.position.y * 8 + this._z;
        return this.position.x;
    }
    set y(a) {
        this.position.y = a;
        this.sprite.x = this.position.x * 16 - this.position.y * 16;
        this.sprite.y = this.position.x * 8 + this.position.y * 8;
        this.sprite.depth = depth.get('tile', this.sprite.y);
        this.sprite.y = this.position.x * 8 + this.position.y * 8 + this._z;
        return this.position.y;
    }
    set z(a) {
        this._z = a;
        this.sprite.y = this.position.x * 8 + this.position.y * 8;
        this.sprite.depth = depth.get('tile', this.sprite.y);
        this.sprite.y = this.position.x * 8 + this.position.y * 8 + this._z;
        return this._z;
    }
    // Frame getters/setters, so frames and such are not to be messed outside of this
    get frame() {
        return this.sprite.texture.frames.findIndex(function (a) { return a === this.sprite.frame });
    }
    set frame(a) {
        const chosen = this.sprite.texture.frames[a - 1];
        if (chosen) {
            this.sprite.frame = chosen;
        }
    }
    destroy() {
        this.sprite.destroy();
    }
    /// Wavy Behaviour
    waveSuper() {
        this.wave = {
            height: 3,
            speed: 1,
            distance: 12
        }
        // Listen to the scene's update event and call waveUpdate on it
        game.scene.keys.default.event.on('update', this.waveUpdate, this);
    }
    waveUpdate(time) {
        this.z = (-0.666 * Math.sin((time * this.wave.speed + this.x * 15 * this.wave.distance) * 0.004) +
            -0.333 * Math.sin((time * this.wave.speed + this.y * 20 * this.wave.distance) * 0.005)) * this.wave.height + this.wave.height;
        this.sprite.alpha = Math.max(Math.min(1 - this.z / this.wave.height * 0.1, 1), 0) * 0.8;
    }
}