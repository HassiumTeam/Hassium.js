const { HassiumObject } = require('./hassiumObject');
const lib = require('./lib');

module.exports = class HassiumBoundFunc extends HassiumObject {
    constructor(func, self) {
        super(lib.HassiumFunc.getType());

        this.func = func;
        this.self = self;
    }

    invoke(vm, mod, args) {
        return this.func.invoke(vm, mod, args, this.self);
    }

    super_(vm, mod, args) {

    }
}
