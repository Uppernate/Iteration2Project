var config = {
    type: Phaser.AUTO,
    pixelArt: true,

    input: {
        activePointers: 10
    },

    clock: {

    },

    scale: {
        parent: 'game',
        mode: Phaser.Scale.RESIZE,
        width: '100%',
        height: '100%'
    },

    physics: {
        default: 'arcade'
    },

    scene: [Scene]
};

const depth = new DepthManager();
var game = new Phaser.Game(config);
