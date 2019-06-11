const { HassiumObject } = require('./hassiumObject');

module.exports = class HassiumInvokable extends HassiumObject {
    constructor(target) {
        super();
        this.target = target;
        this.store_attrib('_invoke', this.invokable_invoke);
    }

    invokable_invoke(vm, mod, args) {
        return this.target(vm, mod, args);
    }
}
