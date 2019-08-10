module.exports = class TypeEnforcementError {
    constructor(types, got, func) {
        this.types = types.map(x => x.name);
        this.got = got.name;
        this.func = func;

        this.toString = function() {
            return `${this.func}: Type ${this.got} was not one of the following types: ${this.types}.`;
        }
    }
};
