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
    ARRAY_DECL,
    BIN_OP,
    CALL,
    ITER,
    ITER_FULL,
    ITER_NEXT,
    JUMP,
    JUMP_IF_FALSE,
    JUMP_IF_TRUE,
    LOAD_ATTRIB,
    LOAD_CLASS_VAR,
    LOAD_LOCAL_VAR,
    POP,
    PUSH,
    RETURN,
    STORE_ATTRIB,
    STORE_CLASS_VAR,
    STORE_LOCAL_VAR,
    UNARY_OP
};

module.exports = { HassiumObject, InstType };
