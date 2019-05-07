// JavaScript source code

class AnimationBlueprint {
    constructor(name, framerate, yoyo, repeat, frameConfig) {
        this.name = name;
        this.key = name;
        this.frameRate = framerate;
        this.yoyo = yoyo;
        this.repeat = repeat;
        this.frameConfig = frameConfig;
    }
}

class AnimationManager {
    constructor() {
        this.units = {
            archer: {
                idle: new AnimationBlueprint('unit-archer-idle', 6, false, -1)
            },
            knight: {
                idle: new AnimationBlueprint('unit-knight-idle', 6, false, -1)
            },
            skeleton: {
                idle: new AnimationBlueprint('unit-skeleton-idle', 6, false, -1)
            }
        };
        this.ui = {
            select: new AnimationBlueprint('select', 24, false, 0, {end: 5}),
            select_move: new AnimationBlueprint('select-move', 24, false, 0),
            select_attack: new AnimationBlueprint('select-attack', 24, false, 0)
        }
        this.tiles = {
            water: new AnimationBlueprint('tile-water', 12, false, -1)
        }
    }
    make() {
        // Turn object into array
        const units = Object.entries(this.units);
        // Every unit animation set, do:
        units.forEach(function(entry) {
            // Turn animation set into array
            const anims = Object.entries(entry[1]);
            // Save unit name
            this.currentUnit = entry[0];
            // Loop through all animations in the unit's animation set
            anims.forEach(this.onUnitAnimMake, this);
        }, this);
        const ui = Object.entries(this.ui);
        ui.forEach(this.onUIAnimMake, this);
        const tiles = Object.entries(this.tiles);
        tiles.forEach(this.onTileAnimMake, this);
    }
    onUnitAnimMake(entry) {
        const anim = entry[1];
        // Generate frame numbers based on spritesheet
        anim.frames = game.scene.keys.default.anims.generateFrameNumbers(anim.name, anim.frameConfig);
        // Create animation for use, save where blueprint was
        this.units[this.currentUnit][entry[0]] = game.scene.keys.default.anims.create(anim);
    }
    onUIAnimMake(entry) {
        const anim = entry[1];
        // Generate frame numbers based on spritesheet
        anim.frames = game.scene.keys.default.anims.generateFrameNumbers(anim.name, anim.frameConfig);
        // Create animation for use, save where blueprint was
        this.ui[entry[0]] = game.scene.keys.default.anims.create(anim);
    }
    onTileAnimMake(entry) {
        const anim = entry[1];
        // Generate frame numbers based on spritesheet
        anim.frames = game.scene.keys.default.anims.generateFrameNumbers(anim.name, anim.frameConfig);
        // Create animation for use, save where blueprint was
        this.tiles[entry[0]] = game.scene.keys.default.anims.create(anim);
    }
    getUnitAnim(unit, anim) {
        return this.units[unit][anim];
    }
    getUIAnim(anim) {
        return this.ui[anim];
    }
    getTileAnim(anim) {
        return this.tiles[anim];
    }
}