const { HassiumObject } = require('../hassiumObject');


module.exports = class HassiumArray extends HassiumObject {
    constructor(init) {
        super();
        this.vals = init;
    }
};
