const { HassiumObject } = require('./hassiumObject');
const util = require('util');

module.exports = class HassiumInvokable extends HassiumObject {
    constructor(obj, attrib, self) {
        super();
        this.obj = obj;
        this.self = self;
        this.attrib = attrib;
    }

    invoke(vm, mod, args) {
        return this.obj[this.attrib](vm, mod, args, this.self);
    }
};
