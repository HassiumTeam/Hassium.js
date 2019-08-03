const { HassiumObject } = require('./hassiumObject');
const lib = require('./lib');

module.exports = class HassiumFunc extends HassiumObject {
    constructor(name) {
        super();
        this.params = [];
        this.set_attrib('_name', new lib.types.HassiumString(name));
    }

    add_param(param) {
        this.params.push(param);
    }
};
