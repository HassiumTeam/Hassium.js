const { HassiumObject } = require('./hassiumObject');
const HassiumString = require('./types/hassiumString');

module.exports = class HassiumFunc extends HassiumObject {
    constructor(name, args) {
        super();
        this.args = args;
        this.params = [];
        this.set_attrib('_name', new HassiumString(name));
    }

    add_param(param) {
        this.params.push(param);
    }
};
