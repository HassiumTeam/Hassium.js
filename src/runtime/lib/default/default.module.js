const Console = require('./console');
const lib = require('../lib');


module.exports = class DefaultModule extends lib.HassiumModule {
    constructor() {
        super('_default');
        this.set_attrib('println', new lib.HassiumInvokable(this.default_println));
    }

    default_println(vm, mod, args) {
        args.forEach(x => console.log(x.toString_(vm, mod, {}).val));
    }
}
