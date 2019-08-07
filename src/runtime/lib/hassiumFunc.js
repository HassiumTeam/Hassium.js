const { HassiumObject } = require('./hassiumObject');
const lib = require('./lib');
var clone = require('clone');

let type = new lib.HassiumType('func');

module.exports = class HassiumFunc extends HassiumObject {
    constructor(name) {
        super(type);
        this.params = [];
        this.set_attrib('_name', new lib.types.HassiumString(name));
    }

    add_param(param) {
        this.params.push(param);
    }

    invoke(vm, mod, args) {
        let ret;

        vm._stack_frame.push_frame();
        this._import_args(vm, mod, args);

        if (this._is_contructor()) {
            ret = this._instantiate();
            vm.run(ret.get_attrib('new'), args);
        } else {
            ret = vm.run(this, args);
        }

        vm._stack_frame.pop_frame();

        return ret;
    }

    _import_args(vm, mod, args) {
        if (args !== undefined) {
            let param;
            for (let i = 0; i < this.params.length; i++) {
                param = this.params[i];
                vm._stack_frame.set_var(param, args[i] ? args[i] : lib.hassiumNull);
            }
        }
    }

    _instantiate() {
        let clazz = new HassiumObject(this.self.type);

        let val;
        for (let key of Object.keys(this.self._attributes)) {
            val = clone(this.self.get_attrib(key));
            val.self = clazz;
            clazz.set_attrib(key, val);
        }

        return clazz;
    }

    _is_contructor() {
        return this.get_attrib('_name').val === "new";
    }
};
