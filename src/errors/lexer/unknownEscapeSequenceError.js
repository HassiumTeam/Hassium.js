module.exports = class UnknownEscapeSequeceError {
    constructor(val, src) {
        this.val = val;
        this.src = src;

        this.toString = function() {
            return `Unknown escape sequence "\\${this.val}"`;
        }
    }
};
