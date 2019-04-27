// JavaScript source code
class ContextNone extends BaseContext {
    constructor() {
        super();
        this.listen('press', this.press, this);
        this.listen('swiping', this.swiping, this);
        this.listen('swipestart', this.swipestart, this);
    }
    press(touch) {
        const pos = this.getScreenPositionByTouch(touch);
        const window = game.scene.keys.default.windowsize;
        if (pos.y < game.scene.keys.default.UIManager.barPosition.y - game.scene.keys.default.camerafocus.y) {
            const tile = this.getTileByTouch(touch);
            this.selection.alpha = 0;
            if (tile) {
                this.displaySelectionAtTile(tile);
                if (tile.unit) {
                    game.scene.keys.default.UIManager.hideActions();
                    game.scene.keys.default.UIManager.selectedUnit = tile.unit;
                    game.scene.keys.default.UIManager.showActions(tile.unit);
                }
                else {
                    game.scene.keys.default.UIManager.selectedUnit = undefined;
                    game.scene.keys.default.UIManager.hideActions();
                }
            }
            else {
                game.scene.keys.default.UIManager.selectedUnit = undefined;
                game.scene.keys.default.UIManager.hideActions();
            }
        }
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