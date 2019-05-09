// JavaScript source code
class BaseHealthBar extends Counter {
    constructor(health, unit) {
        super(0, health, health);
        // Create sprites, background, fill and change amount
        this.bg = game.scene.keys.default.add.sprite(0, 0, 'health-bg')
            .setDepth(depth.get('health', 1));
        this.fill = game.scene.keys.default.add.sprite(0, 0, 'health-fill')
            .setDepth(depth.get('health', 6))
            .setTint(0xf13535)
            .setOrigin(0, 0);
        this.change = game.scene.keys.default.add.sprite(0, 0, 'health-fill')
            .setDepth(depth.get('health', 10))
            .setOrigin(0, 0);
        // Determining how large change part should be
        this.difference = 0;
        // Reference for positioning
        this.unit = unit;
        // Y coordinate offset for stamina bars, etc.
        this.offset = 0;
        // Listen to the update event
        game.scene.keys.default.event.on('update', this.update, this);
        // Keep old scales and compare to stop resizing every update
        this.old_scale;
        this.old_change_scale;
    }
    get value() {
        return this.rawvalue > this.max ? this.max : this.rawvalue < this.min ? this.min : this.rawvalue;
    }
    set value(val) {
        const before = this.value;
        this.rawvalue = val > this.max ? this.max : val < this.min ? this.min : val;
        const after = this.value;
        if (after < before) {
            this.difference += before - after;
        }
    }
    clearDifference() {
        this.difference = 0;
    }
    update() {
        // Set correct positioning
        this.bg.setPosition(this.unit.position.x, this.unit.position.y - 16 + this.offset);
        this.fill.setPosition(this.bg.x - 4, this.bg.y - 1);
        // Determine the fill scale, only change if it is different
        if (this.old_scale !== this.value) {
            this.fill.setScale(this.value / this.max, 1);
            this.old_scale = this.value;
        }
        this.change.setPosition(this.fill.x + this.fill.width * this.value / this.max, this.fill.y);
        // Determine the change scale, only change if it is different
        if (this.old_change_scale !== this.difference) {
            this.change.setScale(this.difference / this.max, 1);
            this.old_change_scale = this.difference;
        }
    }
    destroy() {
        // Kill off sprites Phaser's way, stop listening
        this.bg.destroy();
        this.fill.destroy();
        this.change.destroy();
        game.scene.keys.default.event.off('update', this.update, this);
    }
}