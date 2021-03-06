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
        this.load.spritesheet("tile-water", "img/tile-water.png", { frameWidth: 30, frameHeight: 32, margin: 0, spacing: 0 });

        this.load.spritesheet("unit", "img/unit.png", { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet("select", "img/select.png", { frameWidth: 30, frameHeight: 16 });
        this.load.spritesheet("select-move", "img/select-move.png", { frameWidth: 30, frameHeight: 16 });
        this.load.spritesheet("select-attack", "img/select-attack.png", { frameWidth: 30, frameHeight: 16 });
        this.load.spritesheet("select-stab", "img/select-attack.png", { frameWidth: 30, frameHeight: 16 });

        this.load.spritesheet("select-path-move", "img/select-path-move.png", { frameWidth: 30, frameHeight: 16 });
        this.load.spritesheet("select-path-dash", "img/select-path-dash.png", { frameWidth: 30, frameHeight: 16 });
        this.load.spritesheet("select-path-arrowshoot", "img/select-path-shoot-arrow.png", { frameWidth: 30, frameHeight: 16 });
        this.load.spritesheet("select-path-swing-sword", "img/select-path-swing-sword.png", { frameWidth: 30, frameHeight: 16 });
        this.load.spritesheet("select-path-stab", "img/select-path-swing-sword.png", { frameWidth: 30, frameHeight: 16 });

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
        this.load.image("action-arrowshoot", "img/action-arrowshoot.png");
        this.load.image("action-swing-sword", "img/action-swing-sword.png");
        this.load.image("action-stab", "img/action-stab.png");

        this.load.image("queue-action", "img/queue-action.png");
        this.load.image("queue-action-bg", "img/queue-action-cover.png");

        this.load.image("health-bg", "img/health-bg.png");
        this.load.image("health-fill", "img/health-fill.png");

        this.load.image("play", "img/play.png");
    }
    create() {
        this.map = this.make.tilemap({ key: "tilemap" });
        // Initialise Managers
        this.animationManager.make();
        this.playfield.setupEvents();
        this.touchManager.make();
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
        this.event.emit('update', time, delta);
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