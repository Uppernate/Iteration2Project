// JavaScript source code

class AnimationBlueprint {
    constructor(name, framerate, yoyo, repeat) {
        this.name = name;
        this.key = name;
        this.frameRate = framerate;
        this.yoyo = yoyo;
        this.repeat = repeat;
    }
}

class AnimationManager {
    constructor() {
        this.units = {
            archer: {
                idle: new AnimationBlueprint('unit-archer-idle', 6, false, -1)
            }
        };
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
    }
    onUnitAnimMake(entry) {
        const anim = entry[1];
        // Generate frame numbers based on spritesheet
        anim.frames = game.scene.keys.default.anims.generateFrameNumbers(anim.name);
        // Create animation for use, save where blueprint was
        this.units[this.currentUnit][entry[0]] = game.scene.keys.default.anims.create(anim);
    }
    getUnitAnim(unit, anim) {
        return this.units[unit][anim];
    }
}