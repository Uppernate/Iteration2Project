// JavaScript source code
class MoveAction extends BaseAction {
    constructor(unit) {
        super(unit);
        this.icon = 'move';
        this.range = 3.6; 
        this.stamina = 0.4;
        this.duration = 0.1;
        this.distanceCost = 0.2;
        this.distanceTime = 0.25;
    }
    clicked() {
        const tiles = this.selectTilesByMove();
    }
}