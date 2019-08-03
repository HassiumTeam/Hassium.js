const { HassiumObject } = require('./hassiumObject');
const util = require('util');

module.exports = class HassiumInvokable extends HassiumObject {
    constructor(obj, attrib) {
        super();
        this.obj = obj;
        this.attrib = attrib;
    }

    invoke(vm, mod, args) {
        return this.obj[this.attrib](vm, mod, args);
    }
};
