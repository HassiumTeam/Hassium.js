module.exports = class StackFrame {
    constructor(mod) {
        this._global_frame = {};
        this._frames = [ this._global_frame ];
    }

    get_global(id) {
        return this._global_frame[id];
    }

    get_var(id) {
        return this.peek_frame()[id];
    }

    peek_frame() {
        return this._frames[this._frames.length - 1];
    }

    pop_frame() {
        return this._frames.pop();
    }

    push_frame(frame) {
        this._frames.push(frame ? frame : {});
    }

    set_global(id, val) {
        this._global_frame[id] = val;
    }

    set_var(id, val) {
        this.peek_frame()[id] = val;
        return val;
    }
};
