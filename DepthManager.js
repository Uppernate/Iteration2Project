// JavaScript source code
class DepthManager {
    constructor() {
        this.totalMapHeight = 0;
        this.order = {
            tile: 0,
            tileOverlay: 0.2,
            unit: 64
        }
    }
    get(type, y) {
        return this.order[type] + y;
    }
}