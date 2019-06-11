const { HassiumObject } = require('./hassiumObject');
const lib = require('./lib');

module.exports = class HassiumFunc extends HassiumObject {
    constructor(name, args) {
        super();
        this.store_attrib('_name', new lib.types.HassiumString(name));
        this.store_attrib('_arguments', new lib.types.HassiumArray(args));
    }
}
