class HassiumObject {
    constructor() {
        this._attributes = {};
        this.instructions = [];
        this.labels = {};
    }

    invoke(vm, mod, args) {
    }

    emit(type, args, src) {
        this.instructions.push({ type, args, src });
    }

    emit_label(id) {
        this.labels[id] = this.instructions.length - 1;
    }

    get_attrib(key) {
        return this._attributes[key];
    }

    get_label(id) {
        return this.labels[id];
    }

    set_attrib(key, val) {
        this._attributes[key] = val;
    }

    toString_(vm, mod, args) {
        this.get_attrib('toString').get_attrib('_invoke')(vm, mod, args);
    }

};

const InstType = {
    ARRAY_DECL: "array_decl",
    BIN_OP: "bin_op",
    CALL: "call",
    ITER: "iter",
    ITER_FULL: "iter_full",
    ITER_NEXT: "iter_next",
    JUMP: "jump",
    JUMP_IF_FALSE: "jump_if_false",
    JUMP_IF_TRUE: "jump_if_true",
    LOAD_ATTRIB: "load_attrib",
    LOAD_CONST: "load_const",
    LOAD_GLOBAL: "load_global",
    LOAD_LOCAL: "load_local",
    LOAD_SUBSCRIPT: "load_subscript",
    POP: "pop",
    PUSH: "push",
    RETURN: "return",
    STORE_ATTRIB: "store_attrib",
    STORE_GLOBAL: "store_global",
    STORE_LOCAL: "store_local_var",
    STORE_SUBSCRIPT: "store_subscript",
    UNARY_OP: "unary_op"
};

module.exports = { HassiumObject, InstType };
