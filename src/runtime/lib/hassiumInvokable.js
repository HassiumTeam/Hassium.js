const { HassiumObject } = require('./hassiumObject');
const util = require('util');

module.exports = class HassiumInvokable extends HassiumObject {
    constructor(target) {
        super();
        this.target = target;
        this.set_attrib('_invoke', this.invokable_invoke);
    }

    invokable_invoke(vm, mod, args) {
        let x = this.target;
        console.log(this.target.bind(x)(vm, mod, args));
        //console.log(util.inspect(func(vm, mod, args), { showHidden: true, depth: null }));
    }
};
