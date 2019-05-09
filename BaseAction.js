// JavaScript source code
class BaseAction {
    constructor(unit) {
        this.unit = unit;
        this.icon = 'no-icon';
        this.stamina = 1;
        this.distanceCost = 0.25;
        this.duration = 0.25;
        this.distanceTime = 0.25;
        this.colour = 0x4797FF;
    }
    clicked() {
        console.log('base action does nothing! Override it!');
    }
    cancel() {
        console.log('I dunno if I can do much here');
    }
    begin(bar) {
        console.log('Empty action began, doing nothing!');
    }
    progress(bar, progress) {
        console.log(`Empty action progressing... at ${Math.round(progress * 10000) * 0.01}`);
    }
    end(bar) {
        console.log('Empty action ended!');
    }
    getReference(tile) {
        const reference = this.latestChecked.find(a => a.original === tile);
        return reference;
    }
    getPath(reference) {
        const path = [];
        while (reference) {
            path.push(reference.original);
            reference = reference.parent;
        }
        path.reverse();
        return path;
    }
    calculateStamina(reference) {
        return this.stamina + this.distanceCost * reference.distance;
    }
    calculateTime(reference) {
        return this.duration + this.distanceTime * reference.distance;
    }
    showEverything() {
        game.scene.keys.default.playfield.showUnits();
        game.scene.keys.default.playfield.showTiles();
    }
    switchContextAndPass(state, storage) {
        const manager = game.scene.keys.default.touchManager;
        if (storage) {
            manager.clearStorage();
            const entries = Object.entries(storage);
            entries.forEach(function (a) { manager.storage[a[0]] = a[1]; });
        }
        manager.switchState(state);
    }
    defaultListen() {
        const manager = game.scene.keys.default.touchManager;
        manager.on('context-selected', this.success, this);
        manager.on('context-cancel', this.fail, this);
    }
    defaultDeafen() {
        const manager = game.scene.keys.default.touchManager;
        manager.off('context-selected', this.success, this);
        manager.off('context-cancel', this.fail, this);
    }
    selectTilesByMove() {
        const tile = this.unit.futureTile();
        // Create the first reference
        const reference = new ReferenceTile(tile);
        // Prevent multiple tiles checked more than once + the resulting array
        const checked = [];
        const tiles = [];
        // Constants to use in reference functions (this has different meaning in them)
        const maxStaminaUse = this.unit.staminaleft - this.stamina;
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
            const nearby = game.scene.keys.default.playfield.getTilesAround(this.original);
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
        tiles.splice(tiles.findIndex(a => a === this.unit.futureTile(), this), 1);
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
    selectTilesBySight() {
        const tile = this.unit.futureTile();
        // Create the first reference
        const reference = new ReferenceTile(tile);
        // Prevent multiple tiles checked more than once + the resulting array
        const checked = [];
        const tiles = [];
        // Constants to use in reference functions (this has different meaning in them)
        const maxStaminaUse = this.unit.staminaleft - this.stamina;
        const maxTimeUse = this.unit.timeleft - this.duration;
        const staminaUse = this.distanceCost;
        const timeUse = this.distanceTime;
        const range = this.range;
        // Initialisation of references
        reference.construct = function () {
            this.distance = tile.position.copy().sub(this.original.position).magnitude;
            checked.push(this);
        }
        // The main behaviour of references, new clones of this copy this behaviour
        // Depending on the return of this, the reference will either be successful or fail
        reference.main = function () {
            const start = tile;
            const end = this.original;
            // Get rid of unselectable tiles
            let result = true;
            if (!this.original.selectable) {
                return false;
            }
            // Get rid of tiles out of reach
            if (!((maxStaminaUse - staminaUse * this.distance) > 0 && (maxTimeUse - timeUse * this.distance) > 0 && this.distance <= range)) {
                return false;
            }
            // Calculate gradient
            const change = end.position.copy().sub(start.position);
            const max = Math.max(change.x, change.y);
            change.div(max);
            // Go through gradient until max met
            for (let i = 1; i <= max; i++) {
                const rayTile = game.scene.keys.default.playfield.getTileAt(
                    Math.round(start.position.x + change.x * i),
                    Math.round(start.position.y + change.y * i));
                if (rayTile && rayTile.blocksSight) {
                    result = false;
                    break;
                }
            }
            return result;
        }
        // When the check has been successful, this is executed
        reference.success = function () {
            // Add tile if only it isn't added already
            const registered = tiles.find(a => a === this.original, this);
            if (!registered)
                tiles.push(this.original);
        }
        // Do nothing on fail
        reference.fail = function () { };
        game.scene.keys.default.playfield.tiles.forEach(function (t) {
            reference.copy(t).run();
        }, this);
        // Remove the tile unit is standing on
        tiles.splice(tiles.findIndex(a => a === this.unit.futureTile(), this), 1);
        // Display a temporary graphic over the selected tile for debugging

        this.latestChecked = checked;

        return tiles;
    }
    isPathUnitBlocked(path, startFrom, otherTeamBlock) {

        let tile = startFrom;
        let i = path.findIndex(a => a === startFrom);
        let blocked = false;
        let team;

        if (tile && tile.unit && tile.unit !== this.unit) {
            blocked = true;
            team = tile.unit.team;
        }

        if (team === this.unit.team || !otherTeamBlock) {
            while (blocked && ++i < path.length) {
                tile = path[i];
                if (tile && (!tile.unit || tile.unit === this.unit)) {
                    blocked = false;
                }
            }
        }
        return blocked;
    }
    moveUnitToTile(tile) {
        if (tile !== this.unit.tile) {
            if (!tile.unit) {
                this.unit.tile.unit = undefined;
                tile.unit = this.unit;
                this.unit.tile = tile;
            }
        }
    }
    interpolatePosition(start, end, percent) {
        const sV = new Vector2(start.x * 16 - start.y * 16, start.x * 8 + start.y * 8 - 16 - 2);
        const eV = new Vector2(end.x * 16 - end.y * 16, end.x * 8 + end.y * 8 - 16 - 2);

        this.unit.position.set(sV).lerp(eV, percent);

        this.unit.x = this.unit.position.x;
        this.unit.y = this.unit.position.y;
    }
}