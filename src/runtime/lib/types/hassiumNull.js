const { HassiumObject } = require('../hassiumObject');
const lib = require('../lib');

class HassiumNull extends HassiumObject {
    constructor() {
        super();
        this.set_attrib('_equal', new lib.HassiumInvokable(this, 'null_equal'));
        this.set_attrib('toString', new lib.HassiumInvokable(this, 'null_toString'));
        this.str_val = new lib.types.HassiumString('null');
    }

    null_equal(vm, mod, args) {
        return new lib.types.HassiumNumber(this === args[0] ? 1 : 0);
    }

    null_toString(vm, mod, args) {
        return this.str_val;
    }
};

module.exports = new HassiumNull();
