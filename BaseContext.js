// JavaScript source code
class BaseContext {
    constructor() {
        this.event = new Phaser.Events.EventEmitter();
        game.scene.keys.default.touchManager.event.on('press', this.press, this);
    }
    press(touch) {
        console.log('Base Context said press!');
        this.getTileByTouch(touch);
    }
    destroy() {
        game.scene.keys.default.touchManager.event.off('press', this.press, this);
    }
    getTileByTouch(touch) {
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
        let tile = scene.playfield.get.tile.at(tilePos.x, tilePos.y);
        let frontTile;

        // Swap selected tile to one in front if the unit's invisible hitbox was hit
        if (unitHit && unitHit == 'front') 
            frontTile = scene.playfield.get.tile.at(tilePos.x + 1, tilePos.y + 1);
        if (unitHit && unitHit == 'left') 
            frontTile = scene.playfield.get.tile.at(tilePos.x + 1, tilePos.y);
        if (unitHit && unitHit == 'right') 
            frontTile = scene.playfield.get.tile.at(tilePos.x, tilePos.y + 1);

        if (frontTile && frontTile.unit)
            tile = frontTile;

        // Debug selection
        if (tile) tile.frame = 5;
    }
}