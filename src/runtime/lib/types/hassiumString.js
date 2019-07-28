const { HassiumObject } = require('../hassiumObject');
const HassiumInvokable = require('../hassiumInvokable');

module.exports = class HassiumString extends HassiumObject {
    constructor(val) {
        super();
        this.val = val;
        this.set_attrib('_add', new HassiumInvokable(this, 'string_add'));
        this.set_attrib('toString', new HassiumInvokable(this, 'string_toString'));
    }

    string_add(vm, mod, args) {
        return new HassiumString(this.val + args[0].val);
    }

    string_toString(vm, mod, args) {
        return this;
    }
};
