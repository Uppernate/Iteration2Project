// JavaScript source code
class BaseContext {
    constructor() {
        this.events = [];

        this.selection = game.scene.keys.default.physics.add.sprite(0, 0, 'select');
        this.selection.depth = depth.get('tileOverlay', 0);
        this.selection.alpha = 0;
    }
    press(touch) {
        console.log('Base Context said press!');
    }
    destroy() {
        this.selection.destroy();
        this.events.forEach(function (e) {
            game.scene.keys.default.touchManager.event.off(e.name, e.func, e.context);
        }, this);
    }
    listen(name, func, context) {
        game.scene.keys.default.touchManager.event.on(name, func, context);
        this.events.push({ name: name, func: func, context: context });
    }
    getScreenPositionByTouch(touch) {
        const tilePos = new Vector2(touch);
        const scene = game.scene.keys.default;
        // Convert Touch Position to real world coordinates
        tilePos.div(scene.cameras.main.zoom);
        tilePos.sub(scene.windowsize.copy().div(2));
        return tilePos;
    }
    getTileByTouch(touch, hitunits) {
        const tilePos = new Vector2(touch);
        const scene = game.scene.keys.default;
        // Convert Touch Position to real world coordinates
        tilePos.div(scene.cameras.main.zoom);
        tilePos.sub(scene.windowsize.copy().div(2));
        tilePos.add(scene.camerafocus);

        // Prepare hitting units in front of this tile
        let unitHit = false;
        const hitCheck = new Vector2(tilePos.x, tilePos.y);

        // Convert Real World coordinates (Isometric) to Map coordinates (Orthogonal)
        tilePos.set((tilePos.y + tilePos.x / 2) / 16 + 1, (tilePos.y - tilePos.x / 2) / 16 + 1);
        // Floor result as tiles only exist on whole numbers
        tilePos.x = Math.floor(tilePos.x);
        tilePos.y = Math.floor(tilePos.y);
        // Convert Floored map coordinates back to real world coordinates, so we have tile origin in world position
        const tileOrtho = new Vector2(tilePos.x * 16 - tilePos.y * 16, tilePos.x * 8 + tilePos.y * 8);

        // Convert World coordinates to Tile's Local coordinates
        hitCheck.sub(tileOrtho);

        // If within sprite hitbox, say you hit the unit
        if (Math.abs(hitCheck.x) < 5 && hitCheck.y > -12)
            unitHit = 'front';
        if (hitCheck.x > 11) 
            unitHit = 'left';
        if (hitCheck.x < -11)
            unitHit = 'right';

        // Get tile at floored map coordinates
        let tile = scene.playfield.getTileAt(tilePos.x, tilePos.y);
        if (hitunits) {
            let frontTile;

            // Swap selected tile to one in front if the unit's invisible hitbox was hit
            if (unitHit && unitHit == 'front')
                frontTile = scene.playfield.getTileAt(tilePos.x + 1, tilePos.y + 1);
            if (unitHit && unitHit == 'left')
                frontTile = scene.playfield.getTileAt(tilePos.x + 1, tilePos.y);
            if (unitHit && unitHit == 'right')
                frontTile = scene.playfield.getTileAt(tilePos.x, tilePos.y + 1);

            if (frontTile && frontTile.unit)
                tile = frontTile;
        }

        return tile;
    }
    displaySelectionAtTile(tile) {
        if (tile && tile.selectable) {
            this.selection.alpha = 1;
            this.selection.x = tile.sprite.x;
            this.selection.y = tile.sprite.y - 8;
            this.selection.depth = depth.get('tileOverlay', this.selection.y);
            this.selection.play(game.scene.keys.default.animationManager.getUIAnim('select'));
        }
    }
    moveSelectionToTile(tile) {
        if (tile) {
            this.selection.alpha = 1;
            this.selection.x = tile.sprite.x;
            this.selection.y = tile.sprite.y - 8;
            this.selection.depth = depth.get('tileOverlay', this.selection.y);
            this.selection.play(
                game.scene.keys.default.animationManager.getUIAnim('select'),
                false,
                game.scene.keys.default.animationManager.getUIAnim('select').frames.length - 1
            );
        }
    }
    moveScreen(touch) {
        game.scene.keys.default.camerafocus.sub(touch.swipeVector.div(game.scene.keys.default.cameras.main.zoom));
        touch.startPosition.set(touch.position);
        touch.swipeVector.set(0, 0);
    }
}