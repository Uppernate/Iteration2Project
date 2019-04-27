// Base Scene code

class Scene extends Phaser.Scene {
    constructor(id) {
        super(id);
        // Managers
        this.level = new LevelMaker();
        this.playfield = new Playfield();
        this.animationManager = new AnimationManager();
        this.touchManager = new TouchManager();
        this.UIManager = new UIManager();

        // Objects
        this.event = new Phaser.Events.EventEmitter();

        //Properties
        this.camerafocus = new Vector2( 0, 160);
        this.windowsize = new Vector2(0, 0);

        this.pixelsize = 1;
        this.id = id;
    }
    preload() {
        this.load.tilemapTiledJSON("tilemap", "levels/simple.json");

        this.load.spritesheet("terrain", "img/terrain.png", { frameWidth: 30, frameHeight: 32, margin: 1, spacing: 2 });

        this.load.spritesheet("unit", "img/unit.png", { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet("select", "img/select.png", { frameWidth: 30, frameHeight: 16 });
        this.load.spritesheet("select-move", "img/select-move.png", { frameWidth: 30, frameHeight: 16 });

        this.load.spritesheet("unit-archer-idle", "img/unit-archer-idle.png", { frameWidth: 32, frameHeight: 32 });
        this.load.image("unit-archer-icon", "img/unit-archer-icon.png");

        this.load.spritesheet("unit-knight-idle", "img/unit-knight-idle.png", { frameWidth: 32, frameHeight: 32 });
        this.load.image("unit-knight-icon", "img/unit-knight-icon.png");

        this.load.spritesheet("unit-skeleton-idle", "img/unit-skeleton-idle.png", { frameWidth: 32, frameHeight: 32 });

        this.load.image("ui-window", "img/window.png");
        this.load.image("ui-unit-window", "img/unit-window.png");

        this.load.image("action-no-icon", "img/action-no-icon.png");
        this.load.image("action-move", "img/action-move.png");
        this.load.image("action-dash", "img/action-dash.png");
    }
    create() {
        this.map = this.make.tilemap({ key: "tilemap" });
        // Initialise Managers
        this.touchManager.make();
        this.animationManager.make();
        this.level.make(this.map);
        this.UIManager.make();

        this.scale.on('resize', this.resize, this);

        // Camera
        const pixelSize = Math.ceil(Math.min(this.game.canvas.width / 480, this.game.canvas.height / 270)) * window.devicePixelRatio;
        this.windowsize.set(this.game.canvas.width / pixelSize, this.game.canvas.height / pixelSize);
        this.pixelsize = pixelSize;
        this.cameras.main.zoom = pixelSize;
        this.event.emit('resize');
    }
    update(time, delta) {
        this.event.emit('update', time);
        this.cameras.main.centerOn(Math.round(this.camerafocus.x), Math.round(this.camerafocus.y));
    }
    resize(gameSize, baseSize, displaySize, resolution) {
        const width = displaySize.width;
        const height = displaySize.height;

        const pixelSize = Math.ceil(Math.min(width / 480, height / 270)) * window.devicePixelRatio;

        this.cameras.resize(width, height);
        this.windowsize.set(width / pixelSize, height / pixelSize);
        this.pixelsize = pixelSize;
        this.cameras.main.zoom = pixelSize;
        this.event.emit('resize');
    }
}