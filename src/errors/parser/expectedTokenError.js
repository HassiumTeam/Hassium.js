module.exports = class ExpectedTokenError {
    constructor(type, val, got, src) {
        this.type = type;
        this.val = val;
        this.got = got;
        this.src = src;
        this.toString = function() {
            return `Expected token with type ${this.type} and value ${this.val}, got ${this.got}.`;
        }
    }
};
