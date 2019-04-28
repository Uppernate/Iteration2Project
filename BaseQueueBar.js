// JavaScript source code
class BaseQueueBar {
    constructor() {
        this.position = 0;
        this.bar = game.scene.keys.default.add.nineslice(0, 0, 16, 16, 'queue-action', [7, 6, 3, 6]);
        this.bar.setVisible(false);
        this.bar.depth = depth.get('uiQueueBar', 0);
        this.bg = game.scene.keys.default.add.sprite(0, 0, 'queue-action-bg');
        this.bg.setVisible(false);
        this.bg.depth = depth.get('uiQueueBar', 1);
        this.bg.alpha = 0.5;
        this.icon = game.scene.keys.default.add.sprite(0, 0, 'action-no-icon');
        this.icon.setVisible(false);
        this.icon.depth = depth.get('uiQueueBar', 2);
    }
    show() {
        this.bar.setVisible(true);
        this.bg.setVisible(true);
        this.icon.setVisible(true);
    }
    hide() {
        this.bar.setVisible(false);
        this.bg.setVisible(false);
        this.icon.setVisible(false);
    }
    set x(a) {
        this.bar.x = a;
        this.bg.x = this.bar.x + this.bar.width / 2;
        this.icon.x = this.bg.x;
    }
    set y(a) {
        this.bar.y = a;
        this.bg.y = this.bar.y + this.bar.height / 2;
        this.icon.y = this.bg.y;
    }
    resize(a) {
        this.bar.resize(a, 16);
        this.bg.x = this.bar.x + this.bar.width / 2;
        this.icon.x = this.bg.x;
    }
}