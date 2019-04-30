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
        this.add = {
            tile: function (tile) {
                const playTile = new BaseTile();
                playTile.x = tile.x;
                playTile.y = tile.y;
                playTile.frame = tile.index;
                self.tiles.push(playTile);
            },
            water: function (tile) {
                const playTile = new WaterTile();
                playTile.x = tile.x;
                playTile.y = tile.y;
                playTile.frame = tile.index;
                self.tiles.push(playTile);
            },
            unit: function(unit) {
                let playUnit;
                const left = unit.properties.find(findWithProperty, { name: 'name', value: 'looking_left' });
                const team = unit.properties.find(findWithProperty, { name: 'name', value: 'team' });
                const name = unit.name;
                const tile = self.get.tile.at(unit.x / 16 + 1, unit.y / 16 + 1);

                switch (name) {
                    case 'archer':
                        playUnit = new UnitArcher();
                        break;
                    case 'knight':
                        playUnit = new UnitKnight();
                        break;
                    case 'skeleton':
                        playUnit = new UnitSkeleton();
                        break;
                }

                if (team && team.value === 'player') {
                    game.scene.keys.default.UIManager.addUnit(playUnit);
                }

                if (playUnit) {
                    playUnit.x = unit.x - unit.y;
                    playUnit.y = unit.y / 2 + unit.x / 2 - 2;
                    playUnit.tile = tile;
                    tile.unit = playUnit;

                    if (left && left.value == true)
                        playUnit.sprite.setScale(-1, 1);

                    self.units.push(playUnit);
                }
            }
        };
        this.get = {
            tile: {
                at: function (x, y) {
                    const position = new Vector2(x, y); // Vector2 automatically parses arguments, whether two numbers, one object or vector2
                    return self.tiles.find(function (t) { return t.x === position.x && t.y === position.y });
                },
                around: function (x, y) {
                    const position = new Vector2(x, y);
                    return self.tiles.filter(function (t) {
                        const ax = Math.abs(t.x - position.x);
                        const ay = Math.abs(t.y - position.y);
                        if ((ax == 1 && ay == 0) || (ay == 1 && ax == 0))
                            return true;
                        else if (ax == 1 && ay == 1) {
                            const horizontal = self.get.tile.at(position.x, t.y);
                            const vertical = self.get.tile.at(t.x, position.y);
                            return (horizontal || vertical) ? true : false;
                        }
                    });
                }
            }
        }
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
            this.event.emit('turn-started');
        }
    }
    finishTurn() {
        this.event.emit('turn-finished');
    }
}