// JavaScript source code
class BaseQueueBar {
    constructor() {
        this.position = 0;
        this.bar = game.scene.keys.default.add.nineslice(0, 0, 16, 16, 'queue-action', [7, 6, 3, 6]);
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
    }
    displayPath() {
        this.path.forEach(function (tile, index) {
            // Initialise
            const sprite = game.scene.keys.default.add.sprite(0, 0, `select-path-${this.action.icon}`);
            sprite.setVisible(false).setDepth(depth.get('tileOverlay', tile.sprite.y - tile.z));
            sprite.x = tile.sprite.x;
            sprite.y = tile.sprite.y - 8;

            // Determine direction
            let i = index;
            if (!this.path[index + 1])
                i--;
            const firstTile = this.path[i];
            const lastTile = this.path[i + 1];
            // Calculate difference in positions
            const direction = lastTile.position.copy().sub(firstTile.position);

                // If Adjacent
            if ((Math.abs(direction.x) == 1 && Math.abs(direction.y) == 0) || (Math.abs(direction.x) == 0 && Math.abs(direction.y) == 1)) {
                sprite.setScale(direction.x || (direction.y * -1), 0 - (direction.x || direction.y));
            }
                // Horizontal Diagonals
            else if (Math.abs(direction.x + direction.y) == 0) {
                sprite.frame = sprite.texture.frames[1];
                sprite.setScale(direction.x, 1);
            }
                // Vertical Diagonals
            else if (Math.abs(direction.x + direction.y) == 2) {
                sprite.frame = sprite.texture.frames[2];
                sprite.setScale(1, -direction.y);
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
    }
    hide() {
        this.bar.setVisible(false);
        this.bg.setVisible(false);
        this.icon.setVisible(false);
        this.overlays.forEach(function (a) { a.setVisible(false) });
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
}