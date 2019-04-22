// Base Scene code

class Scene extends Phaser.Scene {
    constructor(id) {
        super(id);
        this.id = id;
        this.level = new LevelMaker();
        this.playfield = new Playfield();
        this.camerafocus = new Vector2( 0, 160);
        this.windowsize = new Vector2(0, 0);
        this.event = new Phaser.Events.EventEmitter();
        this.pixelsize = 1;
    }
    preload() {
        this.load.tilemapTiledJSON("tilemap", "levels/simple.json");

        this.load.spritesheet(
        "terrain",
        "img/terrain.png",
        { frameWidth: 30, frameHeight: 32, margin: 1, spacing: 2 }
    );
    }
    create() {
        this.map = this.make.tilemap({ key: "tilemap" });
        this.level.make(this.map);

        this.scale.on('resize', this.resize, this);

        const pixelSize = Math.ceil(Math.min(this.game.canvas.width / 480, this.game.canvas.height / 270)) * window.devicePixelRatio;
        this.windowsize.set(this.game.canvas.width / pixelSize, this.game.canvas.height / pixelSize);
        this.pixelsize = pixelSize;
        this.cameras.main.zoom = pixelSize;
    }
    update(time, delta) {

        this.cameras.main.centerOn(Math.round(this.camerafocus.x), Math.round(this.camerafocus.y));
        this.event.emit('update', time);
    }
    resize(gameSize, baseSize, displaySize, resolution) {
        const width = displaySize.width;
        const height = displaySize.height;

        const pixelSize = Math.ceil(Math.min(width / 480, height / 270)) * window.devicePixelRatio;

        this.cameras.resize(width, height);
        this.windowsize.set(width / pixelSize, height / pixelSize);
        this.pixelsize = pixelSize;
        this.cameras.main.zoom = pixelSize;
    }
}