// JavaScript source code
class ReferenceTile {
    constructor(tile) {
        this.original = tile;
    }
    run(arg) {
        this.construct(arg);
        const result = this.main();
        if (result) {
            this.success();
        }
        else {
            this.fail();
        }
    }
    copy(newtile) {
        const clone = new ReferenceTile(newtile || this.original);
        clone.construct = this.construct;
        clone.main = this.main;
        clone.success = this.success;
        clone.fail = this.fail;
        return clone;
    }
    get walkable() {
        return this.original.walkable;
    }
}