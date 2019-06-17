const { HassiumObject } = require('./hassiumObject');
const util = require('util');

module.exports = class HassiumInvokable extends HassiumObject {
    constructor(target) {
        super();
        this.target = target;
        this.set_attrib('_invoke', this.invokable_invoke);
    }

    invokable_invoke(vm, mod, args) {
        this.target.default_println(vm, mod, args);
    }
};
