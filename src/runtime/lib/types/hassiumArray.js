const { HassiumObject } = require('../hassiumObject');
const lib = require('../lib');

module.exports = class HassiumArray extends HassiumObject {
    constructor(init) {
        super();
        this.val = init ? init : [];

        this.set_attrib('_add', new lib.HassiumInvokable(this, 'array_add'));
        this.set_attrib('_equal', new lib.HassiumInvokable(this, 'array_equal'));
        this.set_attrib('_index', new lib.HassiumInvokable(this, 'array_index'));
        this.set_attrib('_iter', new lib.HassiumInvokable(this, 'array_iter'));
        this.set_attrib('_store_index', new lib.HassiumInvokable(this, 'array_store_index'));
        this.set_attrib('length', new lib.types.HassiumNumber(this.val.length));
        this.set_attrib('toString', new lib.HassiumInvokable(this, 'array_toString'));
    }

    array_add(vm, mod, args) {
        let arr = [];
        this.val.forEach(x => arr.push(x));
        args[0].val.forEach(x => arr.push(x));

        return new HassiumArray(arr);
    }

    array_equal(vm, mod, args) {
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

    array_index(vm, mod, args) {
        return this.val[args[0].val];
    }

    array_iter(vm, mod, args) {
        return this;
    }

    array_store_index(vm, mod, args) {
        this.val[args[0].val] = args[1];
        return args[1];
    }

    array_toString(vm, mod, args) {
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
