const { HassiumObject } = require('../hassiumObject');
const lib = require('../lib');

let type = new lib.HassiumType('IncorrectTypeException');

module.exports = class HassiumIncorrectTypeException extends HassiumObject {
    constructor() {
        super(type);

        this.set_attrib('_invoke', new lib.HassiumInvokable(this, 'incorrect_type_exception_invoke'));
    }

    incorrect_type_exception_invoke(vm, mod, args) {
        if (!this.enforce_arg_count(vm, mod, args, [ 2 ]) ||
            !args[0].enforce_type(vm, mod, [
                lib.types.listTypeDef,
            ])) {
            return lib.hassiumNull;
        }

        let incorrect_type_exception = new HassiumObject(type);

        incorrect_type_exception.set_attrib('expected', args[0]);
        incorrect_type_exception.set_attrib('got', args[1]);
        incorrect_type_exception.set_attrib('toString',
                            new lib.HassiumInvokable(
                                this,
                                'incorrect_type_exception_toString',
                                incorrect_type_exception));
        incorrect_type_exception.set_attrib('type', new lib.types.HassiumString('INCORRECT_TYPE'));

        return incorrect_type_exception;
    }

    incorrect_type_exception_toString(vm, mod, args, self) {
        if (!this.enforce_arg_count(vm, mod, args, [ 0 ])) {
            return lib.hassiumNull;
        }

        let expected = self.get_attrib('expected').toString_(vm, mod, []).val;
        let got = self.get_attrib('got').name;

        return new lib.types.HassiumString(`Expected anyof ${expected} types, instead got ${got}`);
    }
};
