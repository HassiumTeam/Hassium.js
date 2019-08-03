const { HassiumObject } = require('./hassiumObject');
const lib = require('./lib');

let type = new lib.HassiumType('class');

module.exports = class HassiumClass extends HassiumObject {
    static getType() {
        return type;
    }

    constructor(name) {
        super(type);
        this.set_attrib('_equal', new lib.HassiumInvokable(this, 'equal'));
        this.set_attrib('_name', new lib.types.HassiumString(name));
        this.typedef = new lib.HassiumType(name);
    }

    equal(vm, mod, args) {
        return new lib.types.HassiumNumber(
            this.typedef === args[0] || this === args[0] ? 1 : 0
        );
    }

    invoke(vm, mod, args) {
        return this.get_attrib('new').invoke(vm, mod, args);
    }
};
