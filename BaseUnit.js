// JavaScript source code
class BaseUnit {
    constructor() {
        // Basic values
        this.health = new Counter(0, 1, 1);
        this.stamina = new Counter(0, 5, 5);
        this.position = new Vector2(0, 0);
        this._z = 0;
        // Sprite identifier
        this.name = 'archer';
        // Arrays
        this.actions = [];
        this.buffs = [];
        this.queue = [];
        // Visuals
        this.sprite = game.scene.keys.default.physics.add.sprite(this.position.x, this.position.y, 'unit').setDepth(depth.get('unit', this.y));
        this.ghost = game.scene.keys.default.physics.add.sprite(this.position.x, this.position.y, 'unit').setDepth(depth.get('unit', this.y));
        this.ghost.setAlpha(0.5).setVisible(false);
        // Event listening
        game.scene.keys.default.playfield.event.on('turn-started', this.onTurnStart, this);
        game.scene.keys.default.playfield.event.on('turn-progress', this.onTurnProgress, this);
        game.scene.keys.default.playfield.event.on('turn-finished', this.onTurnFinished, this);
    }
    // Code to keep count what unit types exist
    static types =[];
    static newType(type) {
        if (BaseUnit.types[type]) {
            return new BaseUnit.types[type];
        }
        else {
            return;
        }
    }
    onTurnStart() {
        //console.log('start');
    }
    onTurnProgress(progress) {
        // Current action that should be playing
        let action = this.queue.find( a =>
            a.position <= progress &&
            (a.duration + a.position) > progress
        );
            // an action was playing and is still being played
        if (this.currentAction && this.currentAction === action) {
            action.progress((progress - action.position) / action.duration);
        }
            // an action was playing, but it ended 
        else if (this.currentAction) {
            // Call the end of this action with progress calculation
            this.currentAction.end((progress - this.currentAction.position) / this.currentAction.duration);
            // Fetch another action after the previous, if there is one
            action = this.queue.find(a => a.position <= progress && (a.duration + a.position) > progress);
            // Set new fetched, even if undefined
            this.currentAction = action;
            // If it exists, begin the new action
            if (action)
                action.begin((progress - action.position) / action.duration);
        }
            // no action currently playing, but another one is beginning
        else if (action) {
            this.currentAction = action;
            action.begin((progress - action.position) / action.duration);
        }
    }
    onTurnFinished() {
        this.clearQueue();
    }
    futureTile(time) {
        // Prepare initial variables and results
        let index = 0;
        let bar = this.queue[0];
        let tile = this.tile;
        time = time || game.scene.keys.default.playfield.secondsPerTurn;
        // Stop if bar doesn't exist, or position is greater than time specified
        while (bar && bar.position <= time) {
            // Unit only moves on this property existing
            if (bar.moveTo)
                tile = bar.moveTo;
            // Move onto another queued bar
            index++;
            bar = this.queue[index];
        }
        return tile;
    }
    get timeleft() {
        // Get defined maximum time
        let seconds = game.scene.keys.default.playfield.secondsPerTurn;
        // Go to the last action queued and get when it ends, subtract from max
        if (this.queue.length > 0) {
            seconds -= this.queue[this.queue.length - 1].position + this.queue[this.queue.length - 1].duration;
        }
        return seconds;
    }
    idle(start) {
        if (start) {
            const rand = this.getRandomFrame('idle');
            this.sprite.anims.play(this.getAnimation('idle'), false, rand);
            this.ghost.anims.play(this.getAnimation('idle'), false, rand);
        }
        else {
            this.sprite.anims.play(this.getAnimation('idle'));
            this.ghost.anims.play(this.getAnimation('idle'));
        }
    }
    getRandomFrame(name) {
        return Math.floor(Math.random() * this.getAnimation(name).frames.length);
    }
    getAnimation(name) {
        return game.scene.keys.default.animationManager.getUnitAnim(this.name, name);
    }
    get x() {
        return this.position.x;
    }
    get y() {
        return this.position.y;
    }
    get z() {
        return this._z;
    }
    set x(a) {
        this.position.x = a;
        this.sprite.x = this.position.x;
    }
    set y(a) {
        this.position.y = a;
        this.sprite.depth = depth.get('unit', this.y);
        this.sprite.y = this.position.y + this._z;
    }
    set z(a) {
        this._z = a;
        this.sprite.depth = depth.get('unit', this.y);
        this.sprite.y = this.position.y + this._z;
    }
    refreshGhost() {
        // Get the final tile this unit will move to
        const tile = this.futureTile(game.scene.keys.default.playfield.secondsPerTurn);
        // Only have the ghost appear if
        // This unit is selected
        // Unit's tile is different than in the future
        if (game.scene.keys.default.UIManager.selectedUnit === this && tile !== this.tile) {
            // Turn visible and position correctly
            this.ghost.setVisible(true);
            this.ghost.x = tile.x * 16 - tile.y * 16;
            this.ghost.y = tile.x * 8 + tile .y * 8 - 16 - 2;
            this.ghost.depth = depth.get('ui', this.ghost.y);
        }
        else {
            // Hide otherwise
            this.ghost.setVisible(false);
        }
    }
    damage() {

    }
    death() {

    }
    addActionToQueue(action, info) {
        const bar = new BaseQueueBar();
        bar.action = action;
        bar.duration = info.time;
        bar.tile = info.tile;
        bar.path = info.path;
        bar.icon.setTexture(`action-${action.icon}`);
        bar.bar.setTint(action.colour);

        if (this.queue.length > 0) {
            // Place new action on the right of the last action
            bar.position = this.queue[this.queue.length - 1].position + this.queue[this.queue.length - 1].duration;
        }
        else {
            // If no actions, default to 0
            bar.position = 0;
        }
        this.queue.push(bar);

        switch (info.type) {
            case 'moveTo':
                bar.moveTo = info.tile;
                this.refreshGhost();
                break;
        }

        bar.show();
        return bar;
    }
    clearQueue() {
        while (this.queue.length > 0) {
            const bar = this.queue[0];
            bar.destroy();
            this.queue.splice(0, 1);
        }
        this.refreshGhost();
    }
}