const { HassiumObject } = require('../hassiumObject');
const lib = require('../lib');

let type = new lib.HassiumType('list');

module.exports = class HassiumList extends HassiumObject {
    static getType() {
        return type;
    }

    constructor(init) {
        super(type);
        this.val = init ? init : [];
        this._length = new lib.types.HassiumNumber(this.val.length);

        this.set_attrib('_add', new lib.HassiumInvokable(this, 'list_add'));
        this.set_attrib('_equal', new lib.HassiumInvokable(this, 'list_equal'));
        this.set_attrib('_index', new lib.HassiumInvokable(this, 'list_index'));
        this.set_attrib('_iter', new lib.HassiumInvokable(this, 'list_iter'));
        this.set_attrib('_store_index', new lib.HassiumInvokable(this, 'list_store_index'));
        this.set_attrib('length', this._length);
        this.set_attrib('pop', new lib.HassiumInvokable(this, 'list_pop'));
        this.set_attrib('peek', new lib.HassiumInvokable(this, 'list_peek'));
        this.set_attrib('push', new lib.HassiumInvokable(this, 'list_push'));
        this.set_attrib('toString', new lib.HassiumInvokable(this, 'list_toString'));
    }

    list_add(vm, mod, args) {
        this.enforce_arg_count(vm, mod, args, [ 1 ], 'list_add');
        args[0].enforce_type(vm, mod, [
            lib.types.listTypeDef,
        ], 'list_add');

        let arr = [];
        this.val.forEach(x => arr.push(x));
        args[0].val.forEach(x => arr.push(x));

        return new HassiumList(arr);
    }

    list_equal(vm, mod, args) {
        this.enforce_arg_count(vm, mod, args, [ 1 ], 'list_equal');
        args[0].enforce_type(vm, mod, [
            lib.types.listTypeDef,
        ], 'list_equal');

        let arr = args[0].val;
        if (arr.length != this.val.length) {
            return lib.hassiumFalse;
        }

        for (let i = 0; i < this.val.length; i++) {
            if (!this.val[i].equal(vm, mod, arr[i]).val) {
                return lib.hassiumFalse;
            }
        }

        return lib.hassiumTrue;
    }

    list_index(vm, mod, args) {
        this.enforce_arg_count(vm, mod, args, [ 1 ], 'list_index');
        args[0].enforce_type(vm, mod, [
            lib.types.numberTypeDef,
        ], 'list_index');

        return this.val[args[0].val];
    }

    list_iter(vm, mod, args) {
        this.enforce_arg_count(vm, mod, args, [ 0 ], 'list_iter');

        return this;
    }

    list_peek(vm, mod, args) {
        this.enforce_arg_count(vm, mod, args, [ 0 ], 'list_peek');

        return this.val[this.val.length - 1];
    }

    list_pop(vm, mod, args) {
        this.enforce_arg_count(vm, mod, args, [ 0 ], 'list_pop');

        this._length.val--;
        return this.val.pop();
    }

    list_push(vm, mod, args) {
        this.enforce_arg_count(vm, mod, args, [ 1 ], 'list_push');
        args[0].enforce_type(vm, mod, [
            lib.types.objectTypeDef,
        ], 'list_push');

        this._length.val++;
        this.val.push(args[0]);
        return lib.hassiumNull;
    }

    list_store_index(vm, mod, args) {
        this.enforce_arg_count(vm, mod, args, [ 2 ], 'list_store_index');
        args[0].enforce_type(vm, mod, [
            lib.types.numberTypeDef,
        ], 'list_store_index');
        args[1].enforce_type(vm, mod, [
            lib.types.objectTypeDef,
        ], 'list_store_index');

        this.val[args[0].val] = args[1];
        return args[1];
    }

    list_toString(vm, mod, args) {
        this.enforce_arg_count(vm, mod, args, [ 0 ], 'list_toString');

        let str = "[ ";

        this.val.forEach(function(x) {
            if (x instanceof lib.types.HassiumString) {
                str += `"${x.val}", `;
            } else {
                str += `${x.toString_(vm, mod, args).val}, `;
            }
        });

        str += "]";

        return new lib.types.HassiumString(str);
    }
}
