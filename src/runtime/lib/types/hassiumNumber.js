const { HassiumObject } = require('../hassiumObject');
const lib = require('../lib');

module.exports = class HassiumNumber extends HassiumObject {
    constructor(val) {
        super();
        this.val = val;

        this.set_attrib('_add', new lib.HassiumInvokable(this, 'number_add'));
        this.set_attrib('toString', new lib.HassiumInvokable(this, 'number_toString'));
    }

    number_add(vm, mod, args) {
        return new HassiumNumber(this.val + args[0].val);
    }

    number_div(vm, mod, args) {
        return new HassiumNumber(this.val / args[0].val);
    }

    number_toString(vm, mod, args) {
        return new lib.types.HassiumString(this.val.toString());
    }
}
