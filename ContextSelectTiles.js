// JavaScript source code
class ContextSelectTiles extends BaseContext {
    constructor() {
        super();
        this.listen('press', this.press, this);
        this.listen('swiping', this.swiping, this);
        this.listen('swipestart', this.swipestart, this);
        this.storage = game.scene.keys.default.touchManager.storage;
        this.selects = [];

        this.selectedUnit = game.scene.keys.default.UIManager.selectedUnit;
        this.moveSelectionToTile(this.selectedUnit.tile);

        game.scene.keys.default.playfield.highlightTiles(this.storage.tiles);

        game.scene.keys.default.playfield.hideUnits();

        game.scene.keys.default.playfield.tiles.forEach(function (tile) {
            tile.sprite.setTint(0x9E9E9E);
        }, this);

        game.scene.keys.default.playfield.units.forEach(function (unit) {
            unit.sprite.alpha = 0.2;
        }, this);

        this.storage.tiles.forEach(function (tile) {
            const sprite = game.scene.keys.default.physics.add.sprite(tile.sprite.x, tile.sprite.y - 8, 'select-move');
            sprite.depth = depth.get('tileOverlay', sprite.y);
            sprite.play(game.scene.keys.default.animationManager.getUIAnim('select_move'));
            sprite.tile = tile;
            this.selects.push(sprite);
            tile.sprite.setTint(0xFFFFFF);
        }, this);
    }
    press(touch) {
        const pos = this.getScreenPositionByTouch(touch);
        const window = game.scene.keys.default.windowsize;
        if (pos.y < game.scene.keys.default.UIManager.barPosition.y - game.scene.keys.default.camerafocus.y) {
            const tile = this.getTileByTouch(touch, false);
            if (tile && this.storage.tiles.find(a => a === tile)) {
                game.scene.keys.default.touchManager.event.emit('context-selected', tile);
            }
            else {
                game.scene.keys.default.touchManager.event.emit('context-cancel');
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
    destroy() {
        super.destroy();
        this.selects.forEach(function (sprite) {
            sprite.destroy();
        }, this);
    }
}