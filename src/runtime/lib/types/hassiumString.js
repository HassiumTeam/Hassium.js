const { HassiumObject } = require('../hassiumObject');
const lib = require('../lib');

let type = new lib.HassiumType('string');

module.exports = class HassiumString extends HassiumObject {
    static getType() {
        return type;
    }

    constructor(val) {
        super(type);
        this.val = val;
        this.set_attrib('_add', new lib.HassiumInvokable(this, 'string_add'));
        this.set_attrib('_equal', new lib.HassiumInvokable(this, 'string_equal'));
        this.set_attrib('_index', new lib.HassiumInvokable(this, 'string_index'));
        this.set_attrib('length', new lib.types.HassiumNumber(this.val.length));
        this.set_attrib('toString', new lib.HassiumInvokable(this, 'string_toString'));
    }

    string_add(vm, mod, args) {
        this.enforce_arg_count(vm, mod, args, [ 1 ], 'string_add');
        args[0].enforce_type(vm, mod, [
            lib.types.objectTypeDef,
        ], 'string_add');

        return new HassiumString(this.val + args[0].toString_(vm, mod, []).val);
    }

    string_equal(vm, mod, args) {
        this.enforce_arg_count(vm, mod, args, [ 1 ], 'string_equal');
        args[0].enforce_type(vm, mod, [
            lib.types.stringTypeDef,
        ], 'string_equal');

        return new lib.types.HassiumNumber(this.val == args[0].val ? 1 : 0);
    }

    string_index(vm, mod, args) {
        this.enforce_arg_count(vm, mod, args, [ 1 ], 'string_index');
        args[0].enforce_type(vm, mod, [
            lib.types.numberTypeDef,
        ], 'string_index');

        return new HassiumString(this.val[args[0].val]);
    }

    string_toString(vm, mod, args) {
        this.enforce_arg_count(vm, mod, args, [ 0 ], 'string_toString');

        return this;
    }
};
