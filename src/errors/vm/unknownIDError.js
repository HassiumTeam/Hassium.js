module.exports = class UnkownIDError {
    constructor(id) {
        this.id = id;
        this.toString = function() {
            return `Unknown identifier "${this.id}"`;
        }
    }
};
