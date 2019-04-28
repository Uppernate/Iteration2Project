// JavaScript source code
class BaseAction {
    constructor(unit) {
        this.unit = unit;
        this.icon = 'no-icon';
        this.stamina = 1;
        this.distanceCost = 0.25;
        this.duration = 0.25;
        this.distanceTime = 0.25;
    }
    clicked() {
        console.log('base action does nothing! Override it!');
    }
    makePathFrom(reference) {
        const path = [];
        while (reference) {
            path.push(reference.original);
            reference = reference.parent;
        }
        return path;
    }
    selectTilesByMove() {
        const tile = this.unit.tile;
        // Create the first reference
        const reference = new ReferenceTile(tile);
        // Prevent multiple tiles checked more than once + the resulting array
        const checked = [];
        const tiles = [];
        // Constants to use in reference functions (this has different meaning in them)
        const maxStaminaUse = this.unit.stamina.value - this.stamina;
        const maxTimeUse = this.unit.timeleft - this.duration;
        const staminaUse = this.distanceCost;
        const timeUse = this.distanceTime;
        const range = this.range;
        // Initialisation of references
        reference.construct = function (parent) {
            this.distance = 0;
            this.parent = parent;
            if (parent) {
                this.distance = parent.distance + this.original.position.copy().sub(parent.original.position).magnitude;
            }
        }
        // The main behaviour of references, new clones of this copy this behaviour
        // Depending on the return of this, the reference will either be successful or fail
        reference.main = function () {
            const self = this;
            // Only allow one reference per tile
            const registered = checked.find(a => a.original === self.original);
            if (registered && registered.distance <= this.distance) {
                return false;
            }
            // But, if that reference has a longer distance than the current one, replace it
            else if (registered && registered.distance > this.distance) {
                const index = checked.findIndex(a => a.original === self.original);
                checked[index] = this;
                return this.walkable && (maxStaminaUse - staminaUse * this.distance) > 0 && (maxTimeUse - timeUse * this.distance) > 0 && this.distance <= range;
            }
            // If a reference doesn't exist, push to checked and return
            else {
                checked.push(this);
                return this.walkable && (maxStaminaUse - staminaUse * this.distance) > 0 && (maxTimeUse - timeUse * this.distance) > 0 && this.distance <= range;
            }
        }
        // When the check has been successful, this is executed
        reference.success = function () {
            const self = this;
            // Add tile if only it isn't added already
            const registered = tiles.find(a => a === self.original);
            if (!registered)
                tiles.push(this.original);
            // Get nearest tiles and clone references for them, run the process again
            const nearby = game.scene.keys.default.playfield.get.tile.around(this.original);
            nearby.forEach(function (tile) {
                const clone = this.copy(tile);
                clone.run(this);
            }, this);
        }
        // Do nothing on fail
        reference.fail = function () { };
        // Start the process
        reference.run();
        // Remove the tile unit is standing on
        tiles.splice(tiles.findIndex(a => a === this.unit.tile, this), 1);
        // Display a temporary graphic over the selected tile for debugging
        /*
        tiles.forEach(function (tile) {
            const sprite = game.scene.keys.default.physics.add.sprite(tile.sprite.x, tile.sprite.y - 8, 'select-move');
            sprite.depth = depth.get('tileOverlay', sprite.y);
            sprite.play(game.scene.keys.default.animationManager.getUIAnim('select_move'));
        }, this);
        */

        this.latestChecked = checked;

        return tiles;
    }
}