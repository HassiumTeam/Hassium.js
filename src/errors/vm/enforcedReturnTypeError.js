module.exports = class EnforcedReturnTypeError {
    constructor(func, ret, expected) {
        this.func = func;
        this.ret = ret;
        this.expected = expected;

        this.toString = function() {
            return `${func.get_attrib('_name').val} expected return type ${expected.name}, got ${ret.type.name}`;
        }
    }
};
