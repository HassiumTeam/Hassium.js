const fs = require('fs');
const { HassiumObject } = require('../hassiumObject');
const lib = require('../lib');
const path = require('path');

let type = new lib.HassiumType('File');

module.exports = class HassiumFile extends HassiumObject {
    constructor() {
        super(type);
        this.set_attrib('_invoke', new lib.HassiumInvokable(this, 'file_invoke'));
    }

    file_invoke(vm, mod, args) {
        this.enforce_arg_count(vm, mod, args, [ 1 ], 'File_new');

        args[0].enforce_type(vm, mod, [
            lib.types.stringTypeDef,
        ], 'file_new');

        let file = new HassiumObject(type);

        file.set_attrib('absolute_path', new lib.types.HassiumString(path.resolve(args[0].val)));
        file.set_attrib('create', new lib.HassiumInvokable(this, 'file_create', file));
        file.set_attrib('file_path', args[0]);

        return file;
    }

    file_create(vm, mod, args, self) {
        this.enforce_arg_count(vm, mod, args, [ 0 ], 'file_create');

        let path = self.get_attrib('file_path').val;
        fs.writeFileSync(path, '');

        return lib.hassiumNull;
    }
};
