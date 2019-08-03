const { HassiumObject } = require('./hassiumObject');
const lib = require('./lib');

module.exports = class HassiumType extends HassiumObject {
    constructor(name) {
        super();
        this.name = name;
        this.set_attrib('_equal', new lib.HassiumInvokable(this, 'type_equal'));
        this.set_attrib('toString', new lib.HassiumInvokable(this, 'type_toString'));
    }

    type_equal(vm, mod, args) {
        return args[0] === this;
    }

    type_toString(vm, mod, args) {
        return new lib.types.HassiumString(this.name);
    }
};
