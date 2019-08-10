const { HassiumObject } = require('./hassiumObject');
const lib = require('./lib');

module.exports = class HassiumClosure extends HassiumObject {
    constructor(func, frame, self) {
        super(lib.HassiumFunc.getType());
        this.func = func;
        this.func.self = self;
        this.frame = frame;
    }

    invoke(vm, mod, args) {
        vm._stack_frame.push_frame(this.frame);
        let ret = this.func.invoke(vm, mod, args, true);
        vm._stack_frame.pop_frame();

        return ret;
    }
}
