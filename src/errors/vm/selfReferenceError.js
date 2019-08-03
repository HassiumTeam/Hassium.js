module.exports = class SelfReferenceError {
    constructor(obj, src) {
        this.obj = obj;
        this.src = src;
        this.toString = function() {
            return `No self reference in object type ${this.obj.type}.`;
        }
    }
};
