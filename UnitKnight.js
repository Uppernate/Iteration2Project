// JavaScript source code
class UnitKnight extends BaseUnit {
    constructor() {
        super();
        this.name = 'knight';
        this.idle(true);
        this.actions = [
            new MoveAction(this, {staminaCost: 1.1, timeCost: 1.3, range: 0.8}),
            new DashAction(this, {staminaCost: 1.4, timeCost: 1.3}),
            new BaseAction(this)
        ];
    }
}

BaseUnit.types['knight'] = UnitKnight;