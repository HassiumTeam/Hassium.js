module.exports = class ExpectedNodeError {
    constructor(expected, got, src) {
        this.expected;
        this.got = got;
        this.src = src;

        this.toString = function() {
            return `Expected node with type "${expected}", got "${got}"`;
        }
    }
};
