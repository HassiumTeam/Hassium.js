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
        this.enforce_arg_count(vm, mod, args, [ 1 ], 'type_equal');

        return new lib.types.HassiumNumber(
            args[0] == this || args[0].type == this ? 1 : 0
        );
    }

    type_toString(vm, mod, args) {
        this.enforce_arg_count(vm, mod, args, [ 0 ], 'type_toString');

        return new lib.types.HassiumString(this.name);
    }
};
