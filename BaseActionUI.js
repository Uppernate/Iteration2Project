// JavaScript source code
class BaseActionUI {
    constructor(action) {
        this.action = action;
        this.sprite = game.scene.keys.default.add.nineslice(0, 0, 64, 20, 'ui-window', 4, 4);
        this.icon = game.scene.keys.default.add.sprite(0, 0, `action-${action.icon}`);
        this.sprite.depth = depth.get('uiAction', 0);
        this.icon.depth = depth.get('uiIcon', 0);
        this.icon.setOrigin(0, 0);
    }
    get x() {
        return this.sprite.x;
    }
    get y() {
        return this.sprite.y;
    }
    set x(a) {
        this.sprite.x = a;
        this.icon.x = a + 2;
    }
    set y(a) {
        this.sprite.y = a;
        this.icon.y = a + 2;
    }
    destroy() {
        this.sprite.destroy();
        this.icon.destroy();
    }
}