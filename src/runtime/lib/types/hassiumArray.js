const { HassiumObject } = require('../hassiumObject');
const lib = require('../lib');

module.exports = class HassiumArray extends HassiumObject {
    constructor(init) {
        super();
        this.val = init ? init : [];

        this.set_attrib('_index', new lib.HassiumInvokable(this, 'array_index'));
        this.set_attrib('_store_index', new lib.HassiumInvokable(this, 'array_store_index'));
        this.set_attrib('toString', new lib.HassiumInvokable(this, 'array_toString'));
    }

    array_index(vm, mod, args) {
        return this.val[args[0].val];
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
