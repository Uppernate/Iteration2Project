// JavaScript source code
class WaterTile extends BaseTile {
    constructor() {
        super();
        this.walkable = false;
        this.selectable = false;
        this.blocksSight = false;
        this.waveSuper();
        this.sprite.anims.play(game.scene.keys.default.animationManager.getTileAnim('water'));
    }
}