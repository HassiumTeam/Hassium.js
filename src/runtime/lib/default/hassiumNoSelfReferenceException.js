const { HassiumObject } = require('../hassiumObject');
const lib = require('../lib');

let type = new lib.HassiumType('NoSelfReferenceException');

module.exports = class HassiumNoSelfReferenceException extends HassiumObject {
    constructor() {
        super(type);

        this.set_attrib('_invoke', new lib.HassiumInvokable(this, 'no_self_reference_exception_invoke'));
    }

    no_self_reference_exception_invoke(vm, mod, args) {
        if (!this.enforce_arg_count(vm, mod, args, [ 1 ])) {
            return lib.hassiumNull;
        }

        let no_self_reference_exception = new HassiumObject(type);

        no_self_reference_exception.set_attrib('func', args[0]);
        no_self_reference_exception.set_attrib('toString',
                            new lib.HassiumInvokable(
                                this,
                                'no_self_reference_exception_to_string',
                                no_self_reference_exception));
        no_self_reference_exception.set_attrib('type', new lib.types.HassiumString('NO_SELF_REFERENCE'));

        return no_self_reference_exception;
    }

    no_self_reference_exception_to_string(vm, mod, args, self) {
        if (!this.enforce_arg_count(vm, mod, args, [ 0 ])) {
            return lib.hassiumNull;
        }

        return new lib.types.HassiumString(`No self reference in function ${self.get_attrib('func').name}`);
    }
};
