const HassiumNumber = require('../types/hassiumNumber');
const HassiumInvokable = require('../hassiumInvokable');
const HassiumModule = require('../hassiumModule');

class DefaultModule extends HassiumModule {
    constructor() {
        super('_default');
        this.set_attrib('false', new HassiumNumber(0));
        this.set_attrib('true', new HassiumNumber(1));
        this.set_attrib('println', new HassiumInvokable(this, 'default_println'));

    }

    default_println(vm, mod, args) {
        args.forEach(x => console.log(x.toString_(vm, mod, {}).val));
    }
};

module.exports = new DefaultModule();
