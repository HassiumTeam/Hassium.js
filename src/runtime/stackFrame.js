module.exports = class StackFrame {
    constructor() {
        this._frames = [];
    }

    push_frame() {
        this._frames.push({});
    }

    pop_frame() {
        return this._frames.pop();
    }

    peek_frame() {
        return this._frames[this._frames.length - 1];
    }

    get_var(index) {
        
    }

    set_var(index, val) {
        this.peek_frame()[index] = val;
    }

    contains(index) {
        for (var frame in this._frames) {
            if (frame[index])
                return true;
        }
        return false;
    }
};
