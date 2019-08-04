module.exports = class ArgCountEnforcementError {
    constructor(counts, got, name) {
        this.counts = counts;
        this.got = got;
        this.name = name;

        this.toString = function() {
            return `${this.name}: Expected count to be ${this.counts} got ${this.got}`;
        }
    }
};
