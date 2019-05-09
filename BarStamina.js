// JavaScript source code
class StaminaBar extends BaseHealthBar {
    constructor(health, unit) {
        super(health, unit);
        this.bg.setScale(1, -1);
        this.offset = 1;
        this.fill.setTint(0x3281f8);
        this.change.setOrigin(1, 0);
    }
    get value() {
        return this.rawvalue > this.max ? this.max : this.rawvalue < this.min ? this.min : this.rawvalue;
    }
    set value(val) {
        this.rawvalue = val > this.max ? this.max : val < this.min ? this.min : val;
        return this.value;
    }
    update() {
        super.update();
        this.fill.y = this.bg.y;
        this.change.y = this.fill.y;
        if (this.unit.team == 'enemy') {
            this.change.setVisible(false);
        }
        const used = this.value - this.unit.staminaleft;
        this.change.setScale(used / this.max, 1);

    }
}