const { HassiumObject } = require('../hassiumObject');
const lib = require('../lib');

let type = new lib.HassiumType('number');

module.exports = class HassiumNumber extends HassiumObject {
    static getType() {
        return type;
    }

    constructor(val) {
        super(type);
        this.val = val;

        this.set_attrib('_add', new lib.HassiumInvokable(this, 'number_add'));
        this.set_attrib('_divide', new lib.HassiumInvokable(this, 'number_divide'));
        this.set_attrib('_equal', new lib.HassiumInvokable(this, 'number_equal'));
        this.set_attrib('_greater', new lib.HassiumInvokable(this, 'number_greater'));
        this.set_attrib('_greater_or_equal', new lib.HassiumInvokable(this, 'number_greater_or_equal'));
        this.set_attrib('_lesser', new lib.HassiumInvokable(this, 'number_lesser'));
        this.set_attrib('_lesser_or_equal', new lib.HassiumInvokable(this, 'number_lesser_or_equal'));
        this.set_attrib('_logical_and', new lib.HassiumInvokable(this, 'number_logical_and'));
        this.set_attrib('_logical_or', new lib.HassiumInvokable(this, 'number_logical_or'));
        this.set_attrib('_modulus', new lib.HassiumInvokable(this, 'number_modulus'));
        this.set_attrib('_multiply', new lib.HassiumInvokable(this, 'number_multiply'));
        this.set_attrib('_subtract', new lib.HassiumInvokable(this, 'number_subtract'));
        this.set_attrib('toString', new lib.HassiumInvokable(this, 'number_toString'));
    }

    number_add(vm, mod, args) {
        if (!this.enforce_arg_count(vm, mod, args, [ 1 ]) ||
            !args[0].enforce_type(vm, mod, [
                lib.types.numberTypeDef,
                lib.types.stringTypeDef,
            ])) {
            return lib.hassiumNull;
        }

        if (args[0].type === lib.types.numberTypeDef) {
            return new HassiumNumber(this.val + args[0].val);
        } else {
            return new lib.types.HassiumString(this.val + args[0].val);
        }
    }

    number_divide(vm, mod, args) {
        if (!this.enforce_arg_count(vm, mod, args, [ 1 ]) ||
            !args[0].enforce_type(vm, mod, [
                lib.types.numberTypeDef,
            ])) {
            return lib.hassiumNull;
        }

        return new HassiumNumber(this.val / args[0].val);
    }

    number_equal(vm, mod, args) {
        if (!this.enforce_arg_count(vm, mod, args, [ 1 ]) ||
            !args[0].enforce_type(vm, mod, [
                lib.types.numberTypeDef,
            ])) {
            return lib.hassiumNull;
        }

        return new HassiumNumber(this.val === args[0].val ? 1 : 0);
    }

    number_greater(vm, mod, args) {
        if (!this.enforce_arg_count(vm, mod, args, [ 1 ]) ||
            !args[0].enforce_type(vm, mod, [
                lib.types.numberTypeDef,
            ])) {
            return lib.hassiumNull;
        }

        return new HassiumNumber(this.val > args[0].val ? 1 : 0);
    }

    number_greater_or_equal(vm, mod, args) {
        if (!this.enforce_arg_count(vm, mod, args, [ 1 ]) ||
            !args[0].enforce_type(vm, mod, [
                lib.types.numberTypeDef,
            ])) {
            return lib.hassiumNull;
        }

        return new HassiumNumber(this.val >= args[0].val ? 1 : 0);
    }

    number_lesser(vm, mod, args) {
        if (!this.enforce_arg_count(vm, mod, args, [ 1 ]) ||
            !args[0].enforce_type(vm, mod, [
                lib.types.numberTypeDef,
            ])) {
            return lib.hassiumNull;
        }

        return new HassiumNumber(this.val < args[0].val ? 1 : 0);
    }

    number_lesser_or_equal(vm, mod, args) {
        if (!this.enforce_arg_count(vm, mod, args, [ 1 ]) ||
            !args[0].enforce_type(vm, mod, [
                lib.types.numberTypeDef,
            ])) {
            return lib.hassiumNull;
        }

        return new HassiumNumber(this.val <= args[0].val ? 1 : 0);
    }

    number_logical_and(vm, mod, args) {
        if (!this.enforce_arg_count(vm, mod, args, [ 1 ]) ||
            !args[0].enforce_type(vm, mod, [
                lib.types.numberTypeDef,
            ])) {
            return lib.hassiumNull;
        }

        return new HassiumNumber(this.val != 0 && args[0].val != 0 ? 1 : 0);
    }

    number_logical_or(vm, mod, args) {
        if (!this.enforce_arg_count(vm, mod, args, [ 1 ]) ||
            !args[0].enforce_type(vm, mod, [
                lib.types.numberTypeDef,
            ])) {
            return lib.hassiumNull;
        }

        return new HassiumNumber(this.val != 0 || args[0].val != 0 ? 1 : 0);
    }

    number_modulus(vm, mod, args) {
        if (!this.enforce_arg_count(vm, mod, args, [ 1 ]) ||
            !args[0].enforce_type(vm, mod, [
                lib.types.numberTypeDef,
            ])) {
            return lib.hassiumNull;
        }

        return new HassiumNumber(this.val % args[0].val);
    }

    number_multiply(vm, mod, args) {
        if (!this.enforce_arg_count(vm, mod, args, [ 1 ]) ||
            !args[0].enforce_type(vm, mod, [
                lib.types.numberTypeDef,
            ])) {
            return lib.hassiumNull;
        }

        return new HassiumNumber(this.val * args[0].val);
    }

    number_subtract(vm, mod, args) {
        if (!this.enforce_arg_count(vm, mod, args, [ 1 ]) ||
            !args[0].enforce_type(vm, mod, [
                lib.types.numberTypeDef,
            ])) {
            return lib.hassiumNull;
        }

        return new HassiumNumber(this.val - args[0].val);
    }

    number_toString(vm, mod, args) {
        if (!this.enforce_arg_count(vm, mod, args, [ 0 ])) {
            return lib.hassiumNull;
        }

        return new lib.types.HassiumString(this.val.toString());
    }
}
