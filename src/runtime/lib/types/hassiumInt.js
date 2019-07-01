const { HassiumObject } = require('../hassiumObject');
const lib = require('../lib');

module.exports = class HassiumInt extends HassiumObject {
    constructor(val) {
        super();
        this.val = val;

        this.set_attrib('_add', new lib.HassiumInvokable(this, 'int_add'));
        this.set_attrib('toString', new lib.HassiumInvokable(this, 'int_toString')); 
    }

    int_add(vm, mod, args) {
        return new HassiumInt(this.val + args[0].val);
    }

    int_toString(vm, mod, args) {
        return new lib.types.HassiumString(this.val.toString());
    }
}
