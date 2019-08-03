module.exports = class UnkownIDError {
    constructor(id, src) {
        this.id = id;
        this.src = src;
        this.toString = function() {
            return `Unknown identifier "${this.id}"`;
        }
    }
};
