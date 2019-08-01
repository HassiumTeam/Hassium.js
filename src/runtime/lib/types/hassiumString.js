const { HassiumObject } = require('../hassiumObject');
const HassiumInvokable = require('../hassiumInvokable');
const lib = require('../lib');

module.exports = class HassiumString extends HassiumObject {
    constructor(val) {
        super();
        this.val = val;
        this.set_attrib('_add', new HassiumInvokable(this, 'string_add'));
        this.set_attrib('_equal', new HassiumInvokable(this, 'string_equal'));
        this.set_attrib('_index', new HassiumInvokable(this, 'string_index'));
        this.set_attrib('length', new lib.types.HassiumNumber(this.val.length));
        this.set_attrib('toString', new HassiumInvokable(this, 'string_toString'));
    }

    string_add(vm, mod, args) {
        return new HassiumString(this.val + args[0].val);
    }

    string_equal(vm, mod, args) {
        return new lib.types.HassiumNumber(this.val == args[0].val ? 1 : 0);
    }

    string_index(vm, mod, args) {
        return new HassiumString(this.val[args[0].val]);
    }

    string_toString(vm, mod, args) {
        return this;
    }
};
