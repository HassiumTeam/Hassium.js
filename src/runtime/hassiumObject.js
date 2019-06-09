class HassiumObject {
    constructor() {
        this.instructions = [];
        this.labels = [];
    }

    emit(type, args, src) {
        this.instructions.push({ type, args, src });
    }

    emit_label(id) {
        this.labels.push({
            id,
            pos: this.labels.length
        });
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
    LOAD_CLASS_VAR: "load_class_var",
    LOAD_LOCAL_VAR: "load_local_var",
    POP: "pop",
    PUSH: "push",
    RETURN: "return",
    STORE_ATTRIB: "store_attrib",
    STORE_CLASS_VAR: "store_class_var",
    STORE_LOCAL_VAR: "store_local_var",
    UNARY_OP: "unary_op"
};

module.exports = { HassiumObject, InstType };
