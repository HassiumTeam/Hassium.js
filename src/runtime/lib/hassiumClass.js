const { HassiumObject } = require('./hassiumObject');
const lib = require('./lib');

module.exports = class HassiumClass extends HassiumObject {
    constructor(name, extends_) {
        super(new lib.HassiumType(name));

        this.extends_ = extends_;

        this.set_attrib('_equal', new lib.HassiumInvokable(this, 'class_equal'));
        this.set_attrib('_name', new lib.types.HassiumString(name));
    }

    class_equal(vm, mod, args) {
        if (!this.enforce_arg_count(vm, mod, args, [ 1 ]) ||
            !args[0].enforce_type(vm, mod, [
                lib.types.classTypeDef,
                lib.types.typeTypeDef,
            ])) {
            return lib.hassiumNull;
        }

        return new lib.types.HassiumNumber(
            this.type === args[0] || this === args[0] ? 1 : 0
        );
    }


    instantiate() {
        let clazz = new HassiumObject(this.type);
        clazz.proto = this;

        let keys = Object.keys(this._attributes);
        for (let i = 0; i < keys.length; i++) {
            let key = keys[i];
            let val = this.get_attrib(key);
            if (val instanceof lib.HassiumFunc) {
                val = new lib.HassiumBoundFunc(val, clazz);
            }
            clazz.set_attrib(key, val);
        }

        return clazz;
    }

    invoke(vm, mod, args) {
        let ret = this.instantiate();
        ret.get_attrib('new').invoke(vm, mod, args);

        return ret;
    }
};
