module.exports = class UnknownCharError {
    constructor(c, src) {
        this.c = c;
        this.src = src;

        this.toString = function() {
            return `Unknown char "${this.c}"`;
        }
    }
};
