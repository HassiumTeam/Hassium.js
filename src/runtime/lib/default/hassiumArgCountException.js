const { HassiumObject } = require('../hassiumObject');
const lib = require('../lib');

let type = new lib.HassiumType('ArgCountException');

module.exports = class HassiumArgCountException extends HassiumObject {
    constructor() {
        super(type);

        this.set_attrib('_invoke', new lib.HassiumInvokable(this, 'arg_count_exception_invoke'));
    }

    arg_count_exception_invoke(vm, mod, args) {
        this.enforce_arg_count(vm, mod, args, [2]);

        args[0].enforce_type(vm, mod, [ lib.types.listTypeDef, ]);
        args[1].enforce_type(vm, mod, [ lib.types.numberTypeDef, ]);

        let arg_count_exception = new HassiumObject(type);

        arg_count_exception.set_attrib('expected', args[0]);
        arg_count_exception.set_attrib('got', args[1]);
        arg_count_exception.set_attrib('toString',
                        new lib.HassiumInvokable(
                            this,
                            'arg_count_exception_to_string',
                            arg_count_exception));
        arg_count_exception.set_attrib('type', new lib.types.HassiumString('ARG_COUNT'));
        return arg_count_exception;
    }

    arg_count_exception_to_string(vm, mod, args, self) {
        let expected = self.get_attrib('expected').toString_(vm, mod, []).val;
        let got = self.get_attrib('got').val;

        return new lib.types.HassiumString(`Expected anyof ${expected} argument counts, instead got ${got}`);
    }
};
