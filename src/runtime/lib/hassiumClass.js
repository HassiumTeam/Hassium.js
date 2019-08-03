const { HassiumObject } = require('./hassiumObject');

module.exports = class HassiumClass extends HassiumObject {
    constructor() {
        super();
    }

    invoke(vm, mod, args) {
        return this.get_attrib('new').invoke(vm, mod, args);
    }
};
