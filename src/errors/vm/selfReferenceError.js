module.exports = class SelfReferenceError {
    constructor(obj) {
        this.obj = obj;
        this.toString = function() {
            return `No self reference in object type ${this.obj.type}.`;
        }
    }
};
