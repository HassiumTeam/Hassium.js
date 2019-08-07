const { HassiumObject } = require('./hassiumObject');
const lib = require('./lib');

module.exports = class HassiumClass extends HassiumObject {
    constructor(name) {
        super(new lib.HassiumType(name));
        this.set_attrib('_equal', new lib.HassiumInvokable(this, 'class_equal'));
        this.set_attrib('_name', new lib.types.HassiumString(name));
    }

    class_equal(vm, mod, args) {
        this.enforce_arg_count(vm, mod, args, [ 1 ], 'class_equal');

        args[0].enforce_type(vm, mod, [
            lib.types.classTypeDef,
            lib.types.typeTypeDef,
        ], 'class_equal');

        return new lib.types.HassiumNumber(
            this.type === args[0] || this === args[0] ? 1 : 0
        );
    }

    invoke(vm, mod, args) {
        return this.get_attrib('new').invoke(vm, mod, args);
    }
};
