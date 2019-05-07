// JavaScript source code
class BaseQueueBar {
    constructor() {
        this.position = 0;
        this.bar = game.scene.keys.default.add.nineslice(0, 0, 16, 16, 'queue-action', [7, 6, 3, 6]);
        this.length = 16;
        this.bar.setVisible(false);
        this.bar.depth = depth.get('uiQueueBar', 0);
        this.bg = game.scene.keys.default.add.sprite(0, 0, 'queue-action-bg');
        this.bg.setVisible(false);
        this.bg.depth = depth.get('uiQueueBar', 1);
        this.bg.alpha = 0.5;
        this.icon = game.scene.keys.default.add.sprite(0, 0, 'action-no-icon');
        this.icon.setVisible(false);
        this.icon.depth = depth.get('uiQueueBar', 2);
        this.overlays = [];
        this.bar.on('pointerdown', this.pressed, this);
    }
    displayPath() {
        this.path.forEach(function (tile, i) {
            // Initialise
            const sprite = game.scene.keys.default.add.sprite(0, 0, `select-path-${this.action.icon}`);
            sprite.setVisible(false).setDepth(depth.get('tileOverlay', tile.sprite.y - tile.z));
            sprite.x = tile.sprite.x;
            sprite.y = tile.sprite.y - 8;

            // Determine direction
            let firstTile = this.path[i];
            let lastTile = this.path[i + 1];
            if (!lastTile) {
                lastTile = firstTile;
                firstTile = this.path[i - 1];
            }
            if (!firstTile) {
                firstTile = this.action.unit.futureTile(this.position);
            }
            // Calculate difference in positions
            const direction = lastTile.position.copy().sub(firstTile.position).normalise();

                // Exactly horizontal or vertical
            if ((Math.abs(direction.x) == 1 && Math.abs(direction.y) == 0) || (Math.abs(direction.x) == 0 && Math.abs(direction.y) == 1)) {
                sprite.setScale(direction.x || (direction.y * -1), 0 - (direction.x || direction.y));
            }
            else if (direction.dot(Vector2.right) >= Math.cos(pi / 8)) {
                sprite.setScale(1, -1);
            }
            else if (direction.dot(Vector2.up) >= Math.cos(pi / 8)) {
                sprite.setScale(1, 1);
            }
            else if (direction.dot(Vector2.left) >= Math.cos(pi / 8)) {
                sprite.setScale(-1, 1);
            }
            else if (direction.dot(Vector2.down) >= Math.cos(pi / 8)) {
                sprite.setScale(-1, -1);
            }
            else if (direction.dot(new Vector2(1,1).normalise()) >= Math.cos(pi / 8)) {
                sprite.frame = sprite.texture.frames[2];
                sprite.setScale(1, -1);
            }
            else if (direction.dot(new Vector2(1, -1).normalise()) >= Math.cos(pi / 8)) {
                sprite.frame = sprite.texture.frames[1];
                sprite.setScale(1, 1);
            }
            else if (direction.dot(new Vector2(-1, 1).normalise()) >= Math.cos(pi / 8)) {
                sprite.frame = sprite.texture.frames[1];
                sprite.setScale(-1, 1);
            }
            else if (direction.dot(new Vector2(-1, -1).normalise()) >= Math.cos(pi / 8)) {
                sprite.frame = sprite.texture.frames[2];
                sprite.setScale(1, 1);
            }
            // Save
            this.overlays.push(sprite);
        }, this);
    }
    getOverlaysAt(x, y) {
        // Save unit
        const unit = this.action.unit;
        // Initialise return array
        let overlays = [];
        // Loop through the queue until this bar is met
        for (let i = 0; i < unit.queue.length; i++) {
            const bar = unit.queue[i];
            if (bar === this)
                break;
            // Filter overlays meeting the same coordinate as the tile
            const thisTileOverlays = bar.overlays.filter(sprite => sprite.x === x && sprite.y === y);
            // Add on resulting filtered overlays to main array
            overlays = overlays.concat(thisTileOverlays);
        }
        return overlays;
    }
    show() {
        this.bar.setVisible(true);
        this.bg.setVisible(true);
        this.icon.setVisible(true);
        this.overlays.forEach(function (a) {
            const overlays = this.getOverlaysAt(a.x, a.y);
            if (overlays.length > 0) {
                overlays.forEach(o => o.setVisible(false));
            }
            a.setVisible(true)
        }, this);
        this.bar.setInteractive();
    }
    hide() {
        this.bar.setVisible(false);
        this.bg.setVisible(false);
        this.icon.setVisible(false);
        this.overlays.forEach(function (a) { a.setVisible(false) });
        this.bar.disableInteractive();
    }
    set x(a) {
        this.bar.x = a;
        this.bg.x = this.bar.x + this.bar.width / 2;
        this.icon.x = this.bg.x;
    }
    set y(a) {
        this.bar.y = a;
        this.bg.y = this.bar.y + this.bar.height / 2;
        this.icon.y = this.bg.y;
    }
    resize(a) {
        this.bar.resize(a, 16);
        this.bg.x = this.bar.x + this.bar.width / 2;
        this.icon.x = this.bg.x;
        if (this.length !== a) {
            this.bar.removeInteractive();
            this.bar.setInteractive(new Phaser.Geom.Rectangle(this.bar.x, this.bar.y, a, this.bar.height), Phaser.Geom.Rectangle.Contains);
            this.length = a;
        }
    }
    begin(progress) {
        this.action.begin(this);
        this.action.progress(this, progress);
    }
    progress(progress) {
        this.action.progress(this, progress);
    }
    end(progress) {
        this.action.progress(this, progress);
        this.action.end(this);
    }
    destroy() {
        this.bar.destroy();
        this.bg.destroy();
        this.icon.destroy();
        this.overlays.forEach(function (a) {
            a.destroy();
        }, this);
    }
    pressed(pointer) {
        const pos = game.scene.keys.default.touchManager.state.getScreenPositionByTouch(pointer);
        pos.sub(this.bar);
        game.scene.keys.default.touchManager.storage.drag = {object: this, type: 'queue', offset: pos};
    }
    move(amount, vertical) {
        const queue = this.action.unit.queue;
        const index = queue.findIndex(a => a === this, this);
        if (amount < 0 && index == 0) {
            this.position = Math.max(this.position + amount, 0);
        }
        else if (amount < 0 && index > 0) {
            const left = queue[index - 1];
            amount = -amount;

            const gap = Math.min(this.position - left.position - left.duration, amount);
            this.position -= gap;
            amount -= gap;

            const moveArray = [this, left];
            let depth = index - 2;

            while (amount > 0 && depth >= 0) {
                const deeper = queue[depth];
                const deeperGap = Math.min(moveArray[moveArray.length - 1].position - deeper.position - deeper.duration, amount);
                moveArray.forEach(a => a.position -= deeperGap);
                amount -= deeperGap;
                depth--;
                moveArray.push(deeper);
            }
            if (amount > 0 && depth == -1) {
                const lastGap = Math.min(moveArray[moveArray.length - 1].position, amount);
                moveArray.forEach(a => a.position -= lastGap);
                amount -= lastGap;
            }
        }
        else if (amount > 0 && index == queue.length - 1) {
            this.position += amount;
            this.position = Math.min(this.position, game.scene.keys.default.playfield.secondsPerTurn - this.duration);
        }
        else if (amount > 0 && index != queue.length - 1) {
            const right = queue[index + 1];

            const gap = Math.min(right.position - this.position - this.duration, amount);
            this.position += gap;
            amount -= gap;

            const moveArray = [this, right];
            let depth = index + 2;

            while (amount > 0 && depth < queue.length) {
                const deeper = queue[depth];
                const deeperGap = Math.min(deeper.position - moveArray[moveArray.length - 1].position - moveArray[moveArray.length - 1].duration, amount);
                moveArray.forEach(a => a.position += deeperGap);
                amount -= deeperGap;
                depth++;
                moveArray.push(deeper);
            }
            if (amount > 0 && depth == queue.length) {
                const lastGap = Math.min(game.scene.keys.default.playfield.secondsPerTurn - moveArray[moveArray.length - 1].position - moveArray[moveArray.length - 1].duration, amount);
                moveArray.forEach(a => a.position += lastGap);
                amount -= lastGap;
            }
        }
        if (vertical < -24 && index == queue.length - 1) {
            this.action.unit.queue.splice(this.action.unit.queue.findIndex(a => a === this, this), 1);
            game.scene.keys.default.touchManager.storage.drag = undefined;
            this.destroy();
            this.action.unit.refreshGhost();
        }
    }
}