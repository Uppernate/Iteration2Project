// JavaScript source code
class UIManager {
    constructor() {
        this.units = [];
        this.actions = [];
    }
    make() {
        // Create the Nine Slice objects for the Unit section and the Actions section
        this.window = game.scene.keys.default.add.nineslice(0, 100, 100, 100, 'ui-window', 4, 4);
        this.unitWindow = game.scene.keys.default.add.nineslice(0, 100, 100, 100, 'ui-unit-window', [0, 4, 9, 23]);
        // Set correct depth and make slightly transparent
        this.window.depth = depth.get('ui', 0);
        this.window.alpha = 0.5;
        this.unitWindow.depth = depth.get('ui', 0);
        this.unitWindow.alpha = 0.5;

        // ALso listen to scene's events when they happen for UI Manager's other functions
        game.scene.keys.default.event.on('update', this.update, this);
        game.scene.keys.default.event.on('resize', this.reposition, this);

        this.camerafocus = game.scene.keys.default.camerafocus;
        this.windowsize = game.scene.keys.default.windowsize;
        this.windowhalf = this.windowsize.copy();
        this.barSize = this.windowsize.copy().mul(0.75, 0.22);
        this.barPosition = this.camerafocus.copy().add(this.windowsize.copy().mul(0.5)).sub(this.barSize);
        this.iconPosition = this.camerafocus.copy();
    }
    update() {
        this.units.forEach(this.iconUpdate, this);
        this.reposition();
    }
    reposition() {
        this.barSize.set(this.windowsize).mul(0.75, 0.28);
        this.barSize.y = Math.max(this.barSize.y, 68);
        this.windowhalf.set(this.windowsize).mul(0.5);
        const pos = this.camerafocus.copy();
        // Round just in case
        pos.x = Math.round(pos.x);
        pos.y = Math.round(pos.y);
        this.barPosition
            .set(pos) // Middle of the screen
            .add(this.windowsize.copy().mul(0.5)) // Now bottom right of screen
            .sub(this.barSize); // Size taken away so it's guaranteed this box's right and bottom edge touch the screen border
        this.iconPosition
            .set(this.windowsize.x, 0) // Inversing Bar Size Horizontally, the same but negative Vertically
            .sub(this.barSize)
            .mul(0.5) // Getting the middle 
            .add(pos) // Adding middle of the screen
            .add(-this.windowhalf.x, this.windowhalf.y) // Attaching to bottom left corner

        // This is how you change the size of Nine Sliced objetcs
        this.window.resize(this.barSize.x, this.barSize.y);
        this.unitWindow.resize(this.windowsize.x - this.barSize.x, this.barSize.y);

        // Note: The top left is the origin of nine sliced objects
        this.window.x = this.barPosition.x;
        this.window.y = this.barPosition.y;

        this.unitWindow.x = pos.x - this.windowsize.x * 0.5;
        this.unitWindow.y = this.barPosition.y;

        // Character icons also need repositioning

        this.units.forEach(function (unit) {
            unit.icon.x = this.iconPosition.x;
            unit.icon.y = this.iconPosition.y;
        }, this);

        let offset = 0;

        this.actions.forEach(function (actionTab) {
            actionTab.x = pos.x + this.windowsize.x * 0.5 - this.barSize.x + 4;
            actionTab.y = pos.y + this.windowsize.y * 0.5 - this.barSize.y + 4 + offset;
            offset += 20;
        }, this);
    }
    iconUpdate(unit) {
        let scene = game.scene.keys.default;
        if (unit.unit !== this.selectedUnit) {
            unit.icon.alpha = 0;
        }
        else {
            unit.icon.alpha = 1;
        }
    }
    addUnit(unit) {
        const icon = game.scene.keys.default.physics.add.sprite(0, 160, `unit-${unit.name}-icon`);
        icon.depth = depth.get('uiIcon', 0);
        this.units.push({ unit: unit, icon: icon });
    }
    showActions(unit) {
        console.log('showing actions...');
        let offset = 0;
        const scene = game.scene.keys.default;
        const size = new Vector2(scene.windowsize);
        const pos = new Vector2(scene.camerafocus);
        // Round just in case
        pos.x = Math.round(pos.x);
        pos.y = Math.round(pos.y);

        unit.actions.forEach(function (action) {
            const actionTab = new BaseActionUI(action);
            this.actions.push(actionTab);
            actionTab.x = pos.x - size.x * 0.25 + 4;
            actionTab.y = pos.y + size.y * 0.22 + 4 + offset;
            offset += 20;
            actionTab.sprite.setInteractive();
            actionTab.sprite.on('pointerdown', action.clicked, action);
        }, this);
    }
    hideActions() {
        while (this.actions.length) {
            this.actions[0].destroy();
            this.actions.splice(0, 1);
        }
    }
}