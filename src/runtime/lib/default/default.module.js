const HassiumInvokable = require('../hassiumInvokable');
const HassiumModule = require('../hassiumModule');

class DefaultModule extends HassiumModule {
    constructor() {
        super('_default');
        this.set_attrib('println', new HassiumInvokable(this.default_println));
    }

    default_println(vm, mod, args) {
        args.forEach(x => console.log(x.toString_(vm, mod, {}).val));
    }
};

module.exports = new DefaultModule();
