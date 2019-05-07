// JavaScript source code
class Playfield {
    constructor() {
        this.tiles = [];
        this.units = [];
        this.secondsPerTurn = 2;
        this.progressing = false;
        this.turnProgress = 0;
        this.turnSpeed = 1.0;
        this.event = new Phaser.Events.EventEmitter();
        let self = this;
    }
    addTile(tile, playTile) {
        playTile = playTile || new BaseTile();
        playTile.x = tile.x;
        playTile.y = tile.y;
        playTile.frame = tile.index;
        this.tiles.push(playTile);
    }
    addWater(tile) {
        this.addTile(tile, new WaterTile());
    }
    addUnit(unit) {
        let playUnit;
        const name = unit.name;
        const left = unit.properties.find(findWithProperty, { name: 'name', value: 'looking_left' });
        const team = unit.properties.find(findWithProperty, { name: 'name', value: 'team' });
        const tile = this.getTileAt(unit.x / 16 + 1, unit.y / 16 + 1);
        // Get correct unit class
        playUnit = BaseUnit.newType(name);

        if (playUnit) {
            // Set team and add into UI if Unit is for player to order
            playUnit.team = team.value;
            if (team && team.value === 'player') {
                game.scene.keys.default.UIManager.addUnit(playUnit);
            }
            // Positioning
            playUnit.x = unit.x - unit.y;
            playUnit.y = unit.y / 2 + unit.x / 2 - 2;
            playUnit.tile = tile;
            tile.unit = playUnit;

            if (left && left.value == true)
                playUnit.sprite.setScale(-1, 1);

            this.units.push(playUnit);
        }
    }
    getTileAt(x, y) {
        const position = new Vector2(x, y); // Vector2 automatically parses arguments, whether two numbers, one object or vector2
        return this.tiles.find(t => t.x === position.x && t.y === position.y);
    }
    getTilesAround(x, y) {
        const position = new Vector2(x, y);
        return this.tiles.filter(function (t) {
            const ax = Math.abs(t.x - position.x);
            const ay = Math.abs(t.y - position.y);
                // True if directly horizontal or vertical
            if ((ax == 1 && ay == 0) || (ay == 1 && ax == 0))
                return true;
                // Additional checks for diagonals, you can't squeeze through two touching walls
            else if (ax == 1 && ay == 1) {
                const horizontal = this.getTileAt(position.x, t.y);
                const vertical = this.getTileAt(t.x, position.y);
                return (horizontal || vertical) ? true : false;
            }
        }, this);
    }
    setupEvents() {
        game.scene.keys.default.event.on('update', this.update, this);
    }
    highlightTiles(tiles) {
        this.hideTiles();
        tiles.forEach(function (tile) {
            tile.sprite.setTint(0xFFFFFF);
        }, this);
    }
    hideTiles() {
        this.tiles.forEach(function (tile) {
            tile.sprite.setTint(0x9E9E9E);
        }, this);
    }
    hideUnits() {
        this.units.forEach(function (unit) {
            unit.sprite.alpha = 0.2;
        }, this);
    }
    showTiles() {
        this.tiles.forEach(function (tile) {
            tile.sprite.setTint(0xFFFFFF);
        }, this);
    }
    showUnits() {
        this.units.forEach(function (unit) {
            unit.sprite.alpha = 1;
        }, this);
    }
    update(time, frame) {
        if (this.progressing) {
            this.event.emit('turn-progress', this.turnProgress);
            if (this.turnProgress >= this.secondsPerTurn) {
                this.progressing = false;
                this.turnProgress = 0;
                this.finishTurn();
            }
            this.turnProgress += this.turnSpeed * 0.001 * frame;
            this.turnProgress = Math.min(this.turnProgress, this.secondsPerTurn);
        }
    }
    startTurn() {
        if (!this.progressing) {
            this.progressing = true; // Turn started, trust me
            game.scene.keys.default.UIManager.hideActions();
            game.scene.keys.default.UIManager.selectedUnit = undefined;
            game.scene.keys.default.touchManager.switchState('advancing', {});
            this.units.forEach(function (unit) {
                if (unit.queue.length > 0) {
                    unit.turnsIdle = 0;
                }
                else {
                    unit.turnsIdle++;
                }
            }, this);
            this.event.emit('turn-started');
        }
    }
    finishTurn() {
        game.scene.keys.default.touchManager.switchState('none', {});
        this.event.emit('turn-finished');
        this.units.forEach(function (unit) {
            unit.stamina.value += unit.staminaRegen.fixed +
                                    unit.stamina.max * unit.staminaRegen.percentMax +
                                    (unit.stamina.max - unit.stamina.value) * unit.staminaRegen.percentMissing +
                                    unit.turnsIdle * unit.staminaRegen.percentIdle;
        }, this);
    }
}