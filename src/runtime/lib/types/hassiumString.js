const { HassiumObject } = require('../hassiumObject');

module.exports = class HassiumString extends HassiumObject {
    constructor(val) {
        super();
        this.val = val;
        this.store_attrib('toString', new lib.HassiumInvokable(this.string_toString));
    }

    string_toString(vm, mod, args) {
        return this;
    }
}
