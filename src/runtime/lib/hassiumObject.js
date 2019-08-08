const VMErrors = require('../../errors/vmErrors');

class HassiumObject {
    constructor(type) {
        this._attributes = {};
        this.instructions = [];
        this.labels = {};
        this.type = type;
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

    has_attrib(key) {
        return this._attributes[key] !== undefined;
    }

    set_attrib(key, val) {
        this._attributes[key] = val;
    }

    enforce_arg_count(vm, mod, args, counts, name) {
        if (!counts.includes(args.length)) {
            throw new VMErrors.ArgCountEnforcementError(counts, args.length, name);
        }
    }

    enforce_type(vm, mod, types, name) {
        for (let type of types) {
            if (this.instanceof(vm, mod, type).val) {
                return;
            }
        }

        throw new VMErrors.TypeEnforcementError(types, this.type, name);
    }

    add(vm, mod, arg) {
        return this.get_attrib('_add').invoke(vm, mod, [ arg ]);
    }

    divide(vm, mod, arg) {
        return this.get_attrib('_divide').invoke(vm, mod, [ arg ]);
    }

    equal(vm, mod, arg) {
        if (this.has_attrib('_equal')) {
            return this.get_attrib('_equal').invoke(vm, mod, [ arg ]);
        }

        return object_equal(vm, mod, arg, this);
    }

    greater(vm, mod, arg) {
        return this.get_attrib('_greater').invoke(vm, mod, [ arg ]);
    }

    greater_or_equal(vm, mod, arg) {
        return this.get_attrib('_greater_or_equal').invoke(vm, mod, [ arg ]);
    }

    index(vm, mod, arg) {
        return this.get_attrib('_index').invoke(vm, mod, [ arg ]);
    }

    instanceof(vm, mod, arg) {
        if (arg == lib.types.objectTypeDef) {
            return lib.hassiumTrue;
        } else if (arg == lib.types.typeTypeDef) {
            return arg instanceof lib.HassiumType
                ? lib.hassiumTrue
                : lib.hasisumFalse;
        } else if (this.type.equal(vm, mod, arg).val) {
            return lib.hassiumTrue;
        } else if (arg.type) {
            return this.type.equal(vm, mod, arg.type);
        } else {
            return lib.hassiumFalse;
        }
    }

    invoke(vm, mod, args) {
        return this.get_attrib('_invoke').invoke(vm, mod, args);
    }

    iter(vm, mod) {
        return this.get_attrib('_iter').invoke(vm, mod, []);
    }

    iter_full(vm, mod) {
        return this.get_attrib('_iter_full').invoke(vm, mod, []);
    }

    iter_next(vm, mod) {
        return this.get_attrib('_iter_next').invoke(vm, mod, []);
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

    store_index(vm, mod, key, val) {
        return this.get_attrib('_store_index').invoke(vm, mod, [ key, val ]);
    }

    subtract(vm, mod, arg) {
        return this.get_attrib('_subtract').invoke(vm, mod, [ arg ]);
    }

    toString_(vm, mod, args) {
        if (this.get_attrib('toString').invoke) {
            return this.get_attrib('toString').invoke(vm, mod, args);
        }

        return object_toString(vm, mod, args, this);
    }
};

const InstType = {
    BIN_OP: "bin_op",
    BUILD_CLOSURE: "build_closure",
    CALL: "call",
    COMPILE_MODULE: "compile_module",
    IMPORT: "import",
    ITER: "iter",
    ITER_FULL: "iter_full",
    ITER_NEXT: "iter_next",
    JUMP: "jump",
    JUMP_IF_FALSE: "jump_if_false",
    JUMP_IF_TRUE: "jump_if_true",
    LIST_DECL: "array_decl",
    LOAD_ATTRIB: "load_attrib",
    LOAD_ID: "load_id",
    LOAD_NUMBER: "load_number",
    LOAD_STRING: "load_string",
    LOAD_SUBSCRIPT: "load_subscript",
    OBJ_DECL: "obj_decl",
    OBJ_DESTRUCTURE_GLOBAL: "obj_destructure_global",
    OBJ_DESTRUCTURE_LOCAL: "obj_destructure_local",
    POP: "pop",
    PUSH: "push",
    RETURN: "return",
    SELF_REFERENCE: "self_reference",
    STORE_ATTRIB: "store_attrib",
    STORE_GLOBAL: "store_global",
    STORE_LOCAL: "store_local",
    STORE_SUBSCRIPT: "store_subscript",
    TYPEOF: "typeof",
    UNARY_OP: "unary_op",
    USE_GLOBAL: "use_global",
    USE_LOCAL: "use_local",
};

module.exports = { HassiumObject, InstType, };

const lib = require('./lib');

function object_equal(vm, mod, arg, self) {
    let self_keys = Object.keys(self._attributes);
    let arg_keys = Object.keys(arg._attributes);

    if (self_keys.length != arg_keys.length) {
        return lib.hassiumFalse;
    }

    let arg_val;
    for (let i = 0; i < self_keys.length; i++) {
        arg_val = arg.get_attrib(arg_keys[i]);
        if (arg_val === undefined) {
            return lib.hassiumFalse;
        }

        if (!self.get_attrib(self_keys[i]).equal(vm, mod, arg_val).val) {
            return lib.hassiumFalse;
        }
    }

    return lib.hassiumTrue;
}

function object_toString(vm, mod, args, self) {
    let attrib;
    let str = "{ ";
    Object.keys(self._attributes).forEach(function(x) {
        attrib = self.get_attrib(x);
        str += `${x}: `;
        if (attrib instanceof lib.types.HassiumString) {
            str += `"${attrib.val}", `;
        } else {
            if (attrib === undefined) {
                console.log(self);
            }
            str += `${attrib.toString_(vm, mod, args).val}, `;
        }
    });

    str += "}";

    return new lib.types.HassiumString(str);
}
