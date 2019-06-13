const { HassiumObject } = require('./hassiumObject');

module.exports = class HassiumModule extends HassiumObject {
    constructor(name) {
        this.name = name;
    }
};
