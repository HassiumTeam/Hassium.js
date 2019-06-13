const { HassiumObject } = require('./hassiumObject');
const HassiumArray = require('./types/hassiumArray');
const HassiumString = require('./types/hassiumString');

module.exports = class HassiumFunc extends HassiumObject {
    constructor(name, args) {
        super();
        this.args = args;
        this.store_attrib('_arguments', new HassiumArray(args.forEach(
            x => new HassiumString(x)
        )));
        this.store_attrib('_name', new HassiumString(name));
    }
};
