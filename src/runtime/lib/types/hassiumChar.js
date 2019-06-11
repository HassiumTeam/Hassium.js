const { HassiumObject } = require('../hassiumObject');

module.exports = class HassiumChar extends HassiumObject {
    constructor(val) {
        super();
        this.val = val;
    }
};
