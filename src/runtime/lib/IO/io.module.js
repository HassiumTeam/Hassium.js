const HassiumFile = require('./hassiumFile');
const HassiumModule = require('../hassiumModule');
const lib = require('../lib');

class IOModule extends HassiumModule {
    constructor() {
        super('io');
        this.set_attrib('File', new HassiumFile());
    }
};

module.exports = new IOModule();
