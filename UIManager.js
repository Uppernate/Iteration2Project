// JavaScript source code
class UIManager {
    constructor() {
        this.units = [];
    }
    make() {
        this.window = game.scene.keys.default.add.nineslice(0, 100, 100, 100, 'ui-window', 4, 4);
        this.unitWindow = game.scene.keys.default.add.nineslice(0, 100, 100, 100, 'ui-unit-window', [0, 4, 9, 27]);
        this.window.depth = depth.get('ui', 0);
        this.window.alpha = 0.5;
        this.unitWindow.depth = depth.get('ui', 0);
        this.unitWindow.alpha = 0.5;

        game.scene.keys.default.event.on('update', this.update, this);
        game.scene.keys.default.event.on('resize', this.reposition, this);
    }
    update() {
        this.units.forEach(this.iconUpdate, this);
        this.reposition();
    }
    reposition() {
        let scene = game.scene.keys.default;
        const size = new Vector2(scene.windowsize);
        const pos = new Vector2(scene.camerafocus);
        pos.x = Math.round(pos.x);
        pos.y = Math.round(pos.y);
        size.x *= 0.75;
        size.y *= 0.4;
        size.y -= scene.windowsize.y / 8;

        this.window.resize(size.x, size.y);
        this.unitWindow.resize(scene.windowsize.x - size.x, size.y);

        this.window.x = pos.x - scene.windowsize.x / 4;
        this.window.y = pos.y + scene.windowsize.y * 0.22;
        this.unitWindow.x = pos.x - scene.windowsize.x / 2;
        this.unitWindow.y = pos.y + scene.windowsize.y * 0.22;
        this.units.forEach(function (unit) {
            unit.icon.x = pos.x - scene.windowsize.x * 0.5 + scene.windowsize.x * 0.125;
            unit.icon.y = pos.y + scene.windowsize.y * 0.22 + scene.windowsize.y * 0.1;
        }, this);
    }
    iconUpdate(unit) {
        let scene = game.scene.keys.default;
        if (unit.unit !== this.selectedUnit) {
            unit.icon.alpha = 0;
        }
        else {
            unit.icon.alpha = 1;
        }
    }
    addUnit(unit) {
        const icon = game.scene.keys.default.physics.add.sprite(0, 160, `unit-${unit.name}-icon`);
        icon.depth = depth.get('uiIcon', 0);
        this.units.push({ unit: unit, icon: icon });
    }
}