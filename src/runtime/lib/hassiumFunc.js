const { HassiumObject } = require('./hassiumObject');
const lib = require('./lib');
var clone = require('clone');

module.exports = class HassiumFunc extends HassiumObject {
    constructor(name) {
        super();
        this.params = [];
        this.set_attrib('_name', new lib.types.HassiumString(name));
    }

    add_param(param) {
        this.params.push(param);
    }

    invoke(vm, mod, args) {
        let ret;

        vm._stack_frame.push_frame();
        this._import_args(vm, this, args);

        if (this._is_contructor()) {
            ret = this._instantiate();
            vm.run(this, args);
        } else {
            ret = vm.run(this, args);
        }

        vm._stack_frame.pop_frame();

        return ret;
    }

    _import_args(vm, obj, args) {
        if (args !== undefined) {
            for (let i = 0; i < args.length; i++) {
                vm._stack_frame.set_var(obj.params[i], args[i]);
            }
        }
    }

    _instantiate() {
        let clazz = new HassiumObject();

        let val;
        for (let key of Object.keys(this.self._attributes)) {
            val = clone(this.self.get_attrib(key));
            val.self = clazz;
            clazz.set_attrib(key, val);
        }

        this.self = clazz;

        return clazz;
    }

    _is_contructor() {
        return this.get_attrib('_name').val === "new";
    }
};
