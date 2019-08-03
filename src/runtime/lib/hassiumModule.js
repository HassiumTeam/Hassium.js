const { HassiumObject } = require('./hassiumObject');

modules = {};

module.exports = class HassiumModule extends HassiumObject {
    constructor(name) {
        super();
        this.name = name;
    }
};
