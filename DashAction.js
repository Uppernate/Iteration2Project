// JavaScript source code
class DashAction extends BaseAction {
    constructor(unit) {
        super(unit);
        this.icon = 'dash';
        this.range = 1.5;
        this.stamina = 0.1;
        this.duration = 0.05;
        this.distanceCost = 2.5;
        this.distanceTime = 0.1;
    }
    clicked() {
        const tiles = this.selectTilesByMove();
    }
}