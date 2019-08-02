const { HassiumObject } = require('../hassiumObject');
const lib = require('../lib');

module.exports = class HassiumIter extends HassiumObject {
    constructor(arr) {
        super();
        this.index = 0;
        this.arr = arr;

        this.set_attrib('_iter_full', new lib.HassiumInvokable(this, 'iter_full'));
        this.set_attrib('_iter_next', new lib.HassiumInvokable(this, 'iter_next'));
    }

    iter_full(vm, mod, args) {
        return new lib.types.HassiumNumber(
            this.index >= this.arr.val.length ? 1 : 0
        );
    }

    iter_next(vm, mod, args) {
        return this.arr.val[this.index++];
    }
};
