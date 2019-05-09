// JavaScript source code
class UnitSkeleton extends BaseUnit {
    constructor() {
        super();
        this.name = 'skeleton';
        this.idle(true);
        this.actions = [
            new MoveAction(this, { staminaCost: 1.1, timeCost: 1.3, range: 0.8 }),
            new DashAction(this, { staminaCost: 1.2, timeCost: 1.3 }),
            new StabAction(this)
        ];
    }
}

UNIT_TYPES['skeleton'] = UnitSkeleton;