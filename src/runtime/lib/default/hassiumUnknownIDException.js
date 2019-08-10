const { HassiumObject } = require('../hassiumObject');
const lib = require('../lib');

let type = new lib.HassiumType('UnknownIDException');

module.exports = class HassiumUnknownIDException extends HassiumObject {
    constructor() {
        super(type);

        this.set_attrib('_invoke', new lib.HassiumInvokable(this, 'unknown_id_exception_invoke'));
    }

    unknown_id_exception_invoke(vm, mod, args) {
        if (!this.enforce_arg_count(vm, mod, args, [ 1 ])
            || !args[0].enforce_type(vm, mod, [ lib.types.stringTypeDef ])
            ) {
                return lib.hassiumNull;
        }

        let unknown_id_exception = new HassiumObject(type);

        unknown_id_exception.set_attrib('id', args[0]);
        unknown_id_exception.set_attrib('toString',
                        new lib.HassiumInvokable(
                            this,
                            'unknown_id_exception_to_string',
                            unknown_id_exception,
                        ));
        unknown_id_exception.set_attrib('type', new lib.types.HassiumString('UNKNOWN_ID'));

        return unknown_id_exception;
    }

    unknown_id_exception_to_string(vm, mod, args, self) {
        if (!this.enforce_arg_count(vm, mod, args, [ 0 ])) {
            return lib.hassiumNull;
        }

        return new lib.types.HassiumString(`Unknown ID with value "${self.get_attrib('id').val}"`);
    }
}
