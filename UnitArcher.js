// JavaScript source code
class UnitArcher extends BaseUnit {
    constructor() {
        super();
        this.name = 'archer';
        this.idle(true);
        this.actions = [
            new BaseAction(this),
            new BaseAction(this),
            new BaseAction(this)
        ];
    }
}