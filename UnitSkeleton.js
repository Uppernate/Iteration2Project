// JavaScript source code
class UnitSkeleton extends BaseUnit {
    constructor() {
        super();
        this.name = 'skeleton';
        this.idle(true);
    }
}

BaseUnit.types['skeleton'] = UnitSkeleton;