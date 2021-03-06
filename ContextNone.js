// JavaScript source code
class ContextNone extends BaseContext {
    constructor() {
        super();
        this.listen('press', this.press, this);
        this.listen('swiping', this.swiping, this);
        this.listen('swipestart', this.swipestart, this);
        this.listen('swipe', this.swipeEnd, this);
        this.storage = game.scene.keys.default.touchManager.storage;

        this.selectedUnit = game.scene.keys.default.UIManager.selectedUnit;
        if (this.selectedUnit)
            this.moveSelectionToTile(this.selectedUnit.tile);
    }
    press(touch) {
        const pos = this.getScreenPositionByTouch(touch);
        const window = game.scene.keys.default.windowsize;
        if (pos.y < game.scene.keys.default.UIManager.barPosition.y - game.scene.keys.default.camerafocus.y) {
            const tile = this.getTileByTouch(touch, true);
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
        else if (this.storage.drag) {
            touch.drag = true;
        }
    }
    swiping(touch) {
        if (touch.valid) 
            this.moveScreen(touch);
        else if (touch.drag && this.storage.drag && this.storage.drag.type == 'queue') {
            const pos = this.getScreenPositionByTouch(touch);
            const bar = this.storage.drag.object;
            pos.sub(this.storage.drag.offset);
            pos.sub(bar.bar);
            pos.div((game.scene.keys.default.UIManager.barSize.x - 8) / game.scene.keys.default.playfield.secondsPerTurn, 1);
            bar.move(pos.x, pos.y);
        }
    }
    swipeEnd(touch) {
        if (touch.drag && this.storage.drag && this.storage.drag.type == 'queue') {
            this.storage.drag = undefined;
        }
    }
}