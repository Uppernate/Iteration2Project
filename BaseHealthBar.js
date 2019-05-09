// JavaScript source code
class BaseHealthBar extends Counter {
    constructor(health, unit) {
        super(0, health, health);
        this.bg = game.scene.keys.default.add.sprite(0, 0, 'health-bg')
            .setDepth(depth.get('health', 1));
        this.fill = game.scene.keys.default.add.sprite(0, 0, 'health-fill')
            .setDepth(depth.get('health', 6))
            .setTint(0xf13535)
            .setOrigin(0, 0);
        this.change = game.scene.keys.default.add.sprite(0, 0, 'health-fill')
            .setDepth(depth.get('health', 10))
            .setOrigin(0, 0);
        this.difference = 0;
        this.unit = unit;
        this.offset = 0;
        game.scene.keys.default.event.on('update', this.update, this);
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
        this.bg.x = this.unit.position.x;
        this.bg.y = this.unit.position.y - 16 + this.offset;
        this.fill.x = this.bg.x - 4;
        this.fill.y = this.bg.y - 1;
        if (this.old_scale !== this.value) {
            this.fill.setScale(this.value / this.max, 1);
            this.old_scale = this.value;
        }
        this.change.x = this.fill.x + this.fill.width * this.value / this.max;
        this.change.y = this.fill.y;
        if (this.old_change_scale !== this.difference) {
            this.change.setScale(this.difference / this.max, 1);
            this.old_change_scale = this.difference;
        }
    }
}