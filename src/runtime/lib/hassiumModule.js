const { HassiumObject } = require('./hassiumObject');
const lib = require('./lib');

modules = {};

module.exports = class HassiumModule extends HassiumObject {
    constructor(name) {
        super();
        this.name = name;
    }
};
