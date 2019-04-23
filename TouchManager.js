// JavaScript source code
class Touch {
    constructor(pointer) {
        this.identifier = pointer.identifier;
        this.position = new Vector2(pointer.x, pointer.y);
        this.startPosition = this.position.copy();
        this.swipeVector = new Vector2(0, 0);
        this.rawtime = new Date().getTime();
        this.type = 'basic';
    }
    copy(pointer) {
        this.position.set(pointer.x, pointer.y);
        this.swipeVector.set(this.position).sub(this.startPosition);
    }
    get x() {
        return this.position.x;
    }
    get y() {
        return this.position.y;
    }
    get lifetime() {
        return new Date().getTime() - this.rawtime;
    }
}

class TouchManager {
    constructor() {
        this.touches = [];
        this.storage = {};
        this.event = new Phaser.Events.EventEmitter();
    }
    make() {
        this.scene = game.scene.keys.default;
        this.state = new ContextNone();
        this.scene.input.on('pointerdown', this.handleStart, this);
        this.scene.input.on('pointerup', this.handleEnd, this);
        this.scene.input.on('pointermove', this.handleMove, this);
        this.scene.input.on('pointercancel', this.handleEnd, this);
        this.scene.event.on('update', this.update, this);
    }
    // Creating a touch from given pointer
    handleStart(pointer) {
        this.touches.push(new Touch(pointer));
    }
    // Calling ending functions from the Context
    // Removing correct touch from this.touches
    handleEnd(pointer) {
        let touch = this.touches.find(function (a) { return pointer.identifier == a.identifier });
        if (touch.type == 'basic' && touch.lifetime <= 166) {
            this.event.emit('press', touch);
        }
        else if (touch.type == 'basic' && touch.swipeVector.magnitude < 4) {
            this.event.emit('hold', touch);
        }
        else {
            this.event.emit('swipe', touch);
        }
        this.touches.splice(this.touches.findIndex(function (a) { return pointer.identifier == a.identifier }), 1);
    }
    // Updating correct touch with pointer data
    handleMove(pointer) {
        let touch = this.touches.find(function (a) { return pointer.identifier == a.identifier });
        if (touch)
            touch.copy(pointer);
    }
    // Calling continuous functions from Context
    touchUpdate(touch) {
        if (touch.type == 'basic' && touch.lifetime > 100 && touch.swipeVector.magnitude < 4) {
            this.event.emit('holding', touch);
        }
        else if (touch.swipeVector.magnitude > 4) {
            touch.type = "swipe";
            this.event.emit('swiping', touch);
        }
    }
    // Calling for each on all touches to execute touchUpdate
    update() {
        this.touches.forEach(this.touchUpdate, this);
    }
    switchState(name) {
        switch (name) {
            case 'none':
                this.state = new ContextNone(this);
                break;
            case 'unit':
                this.state = new ContextOnUnit(this);
                break;
            case 'select_tiles':
                this.state = new ContextSelectTiles(this);
                break;
            case 'advancing':
                this.state = new ContextAdvancingPlay(this);
                break;
        }
    }
}