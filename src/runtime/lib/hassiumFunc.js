var clone = require('clone');
const { FuncParamType } = require('../../node');
const { HassiumObject } = require('./hassiumObject');
const lib = require('./lib');
const VMErrors = require('../../errors/vmErrors');

let type = new lib.HassiumType('Func');

module.exports = class HassiumFunc extends HassiumObject {
    static getType() {
        return type;
    }

    constructor(name, params, enforced_ret) {
        super(type);
        this.enforced_ret = enforced_ret;

        this.params = params;
        this.set_attrib('_name', new lib.types.HassiumString(name));
    }

    invoke(vm, mod, args, isClosure) {
        let ret;

        if (isClosure !== true) {
            vm._stack_frame.push_frame();
        }

        this._import_args(vm, mod, args);

        if (this._is_contructor()) {
            ret = this._instantiate();
            vm.run(ret.get_attrib('new'), args);
        } else {
            ret = vm.run(this, args);
        }

        if (isClosure !== true) {
            vm._stack_frame.pop_frame();
        }

        if (this.enforced_ret) {
            let ret_type = vm.resolve_access_chain(this.enforced_ret);
            if (!ret.instanceof(vm, mod, ret_type).val) {
                throw new VMErrors.EnforcedReturnTypeError(
                    this,
                    ret,
                    ret_type instanceof lib.HassiumType
                        ? ret_type
                        : ret_type.type,
                )
            }
        }

        return ret;
    }

    _import_args(vm, mod, args) {
        if (args !== undefined) {
            let arg, param;
            for (let i = 0; i < this.params.length; i++) {
                arg = args[i] ? args[i] : lib.hassiumNull;
                param = this.params[i];

                switch (param.type) {
                    case FuncParamType.ENFORCED:
                        let arg_type = vm.resolve_access_chain(param.enforced_type);
                        if (!arg.instanceof(vm, mod, arg_type).val) {
                            throw new VMErrors.EnforcedParamTypeError(
                                this,
                                arg,
                                arg_type instanceof lib.HassiumType
                                    ? arg_type
                                    : arg_type.type,
                            );
                        }
                        vm._stack_frame.set_var(param.val, arg);
                        break;
                    case FuncParamType.OBJECT:
                        let arg_;
                        for (let id of param.vals) {
                            arg_ = arg.get_attrib(id);
                            vm._stack_frame.set_var(id,
                                arg_
                                ? arg_
                                : lib.hassiumNull
                            );
                        }
                        break;
                    case FuncParamType.REGULAR:
                        vm._stack_frame.set_var(param.val, arg);
                        break;
                }
            }
        }
    }

    _instantiate() {
        let clazz = new HassiumObject(this.self.type);

        let val;
        for (let key of Object.keys(this.self._attributes)) {
            val = clone(this.self.get_attrib(key));
            if (val) {
                val.self = clazz;
                clazz.set_attrib(key, val);
            }
        }

        return clazz;
    }

    _is_contructor() {
        return this.get_attrib('_name').val === "new";
    }
};
