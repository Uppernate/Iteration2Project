// JavaScript source code
class UnitArcher extends BaseUnit {
    constructor() {
        super();
        this.name = 'archer';
        this.idle(true);
        this.actions = [
            new MoveAction(this, {}),
            new DashAction(this, {}),
            new ShootArrowAction(this)
        ];
    }
}

UNIT_TYPES['archer'] = UnitArcher;