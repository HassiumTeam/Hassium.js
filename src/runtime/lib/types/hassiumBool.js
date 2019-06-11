const { HassiumObject } = require('../hassiumObject');

module.exports = class HassiumBool extends HassiumObject {
    constructor(val) {
        super();
        this.val = val;
    }
};
