const fs = require('fs');
const { HassiumObject } = require('../hassiumObject');
const lib = require('../lib');
const path = require('path');

module.exports = class HassiumFile extends HassiumObject {
    constructor() {
        super();
        this.set_attrib('_invoke', new lib.HassiumInvokable(this, 'file_invoke'));
    }

    file_invoke(vm, mod, args) {
        let file = new HassiumObject();

        file.set_attrib('absolute_path', path.resolve(args[0].val));
        file.set_attrib('create', new lib.HassiumInvokable(this, 'file_create', file));
        file.set_attrib('file_path', args[0]);

        return file;
    }

    file_create(vm, mod, args, self) {
        let path = self.get_attrib('file_path').val;

        fs.writeFileSync(path, '');

        return lib.hassiumNull;
    }
};
