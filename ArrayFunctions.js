// JavaScript source code
function findWithProperty(obj) {
    return obj[this.name] === this.value;
}

function doubleForEach(obj) {
    obj.forEach(this.func, this.scope);
}