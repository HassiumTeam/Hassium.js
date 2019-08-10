module.exports = class EnforcedParamTypeError {
    constructor(func, arg, expected) {
        this.func = func;
        this.arg = arg;
        this.expected = expected;

        this.toString = function() {
            return `${func.get_attrib('_name').val} expected param type ${expected.name}, got ${arg.type.name}`;
        }
    }
};
