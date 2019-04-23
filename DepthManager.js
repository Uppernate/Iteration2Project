// JavaScript source code
class DepthManager {
    constructor() {
        this.totalMapHeight = 0;
        this.order = {
            tile: 0,
            tileOverlay: 42,
            unit: 64,
            ui: 10000,
            uiIcon: 12000
        }
    }
    get(type, y) {
        return this.order[type] + y;
    }
}