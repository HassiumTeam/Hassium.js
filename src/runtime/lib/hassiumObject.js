class HassiumObject {
    constructor(type) {
        this.type = type;
        this._attributes = {};
        this.instructions = [];
        this.labels = {};
    }

    invoke(vm, mod, args) {
        vm._stack_frame.push_frame();
        vm.run(this, args);
        vm._stack_frame.pop_frame();
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

    add(vm, mod, arg) {
        return this.get_attrib('_add').invoke(vm, mod, [ arg ]);
    }

    divide(vm, mod, arg) {
        return this.get_attrib('_divide').invoke(vm, mod, [ arg ]);
    }

    equal(vm, mod, arg) {
        return this.get_attrib('_equal').invoke(vm, mod, [ arg ]);
    }

    greater(vm, mod, arg) {
        return this.get_attrib('_greater').invoke(vm, mod, [ arg ]);
    }

    greater_or_equal(vm, mod, arg) {
        return this.get_attrib('_greater_or_equal').invoke(vm, mod, [ arg ]);
    }

    lesser(vm, mod, arg) {
        return this.get_attrib('_lesser').invoke(vm, mod, [ arg ]);
    }

    lesser_or_equal(vm, mod, arg) {
        return this.get_attrib('_lesser_or_equal').invoke(vm, mod, [ arg ]);
    }

    logical_and(vm, mod, arg) {
        return this.get_attrib('_logical_and').invoke(vm, mod, [ arg ]);
    }

    logical_or(vm, mod, arg) {
        return this.get_attrib('_logical_or').invoke(vm, mod, [ arg ]);
    }

    modulus(vm, mod, arg) {
        return this.get_attrib('_modulus').invoke(vm, mod, [ arg ]);
    }

    multiply(vm, mod, arg) {
        return this.get_attrib('_multiply').invoke(vm, mod, [ arg ]);
    }

    subtract(vm, mod, arg) {
        return this.get_attrib('_subtract').invoke(vm, mod, [ arg ]);
    }

    toString_(vm, mod, args) {
        return this.get_attrib('toString').invoke(vm, mod, args);
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
    LOAD_ID: "load_id",
    LOAD_SUBSCRIPT: "load_subscript",
    POP: "pop",
    PUSH: "push",
    RETURN: "return",
    SELF_REFERENCE: "self_reference",
    STORE_ATTRIB: "store_attrib",
    STORE_GLOBAL: "store_global",
    STORE_LOCAL: "store_local",
    STORE_SUBSCRIPT: "store_subscript",
    UNARY_OP: "unary_op",
};

module.exports = { HassiumObject, InstType, };
