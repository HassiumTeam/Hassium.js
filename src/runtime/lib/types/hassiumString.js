const { HassiumObject } = require('../hassiumObject');
const HassiumInvokable = require('../hassiumInvokable');

module.exports = class HassiumString extends HassiumObject {
    constructor(val) {
        super();
        this.val = val;
        this.store_attrib('toString', new HassiumInvokable(this.string_toString));
    }

    string_toString(vm, mod, args) {
        return this;
    }
};
