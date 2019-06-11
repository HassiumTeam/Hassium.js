const { HassiumObject } = require('../hassiumObject');

module.exports = class HassiumInt extends HassiumObject {
    constructor(val) {
        super();
        this.val = val;
    }
}
