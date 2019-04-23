// JavaScript source code
class ContextNone extends BaseContext {
    constructor() {
        super();
        this.listen('press', this.press, this);
        this.listen('swiping', this.swiping, this);
    }
    press(touch) {
        const tile = this.getTileByTouch(touch);
        this.selection.alpha = 0;
        if (tile) {
            this.displaySelectionAtTile(tile);
            if (tile.unit) {
                game.scene.keys.default.UIManager.selectedUnit = tile.unit;
            }
            else {
                game.scene.keys.default.UIManager.selectedUnit = undefined;
            }
        }
        else {
            game.scene.keys.default.UIManager.selectedUnit = undefined;
        }
    }
    swiping(touch) {
        this.moveScreen(touch);
    }
}