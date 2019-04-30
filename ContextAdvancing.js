// JavaScript source code
class ContextAdvancing extends BaseContext {
    constructor() {
        super();
        this.listen('swiping', this.swiping, this);
        this.listen('swipestart', this.swipestart, this);

        this.selectedUnit = game.scene.keys.default.UIManager.selectedUnit;
        if (this.selectedUnit)
            this.moveSelectionToTile(this.selectedUnit.tile);
    }
    swipestart(touch) {
        const pos = this.getScreenPositionByTouch(touch);
        const window = game.scene.keys.default.windowsize;
        if (pos.y < game.scene.keys.default.UIManager.barPosition.y - game.scene.keys.default.camerafocus.y) {
            touch.valid = true;
        }
    }
    swiping(touch) {
        if (touch.valid)
            this.moveScreen(touch);
    }
}