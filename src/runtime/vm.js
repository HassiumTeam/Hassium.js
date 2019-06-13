const { BinOpType, UnaryOpType } = require('../node');
const { HassiumObject, InstType } = require('./lib/hassiumObject');
const lib = require('./lib/lib');
const StackFrame = require('./stackFrame');

module.exports = class VM {
    run(obj) {
        this.stack = [];
        this.stackFrame = new StackFrame();

        let pos = 0;
        let inst, target, val, args;
        while (pos < obj.instructions.length) {
            inst = obj.instructions[pos];

            switch (inst.type) {
                case InstType.ARRAY_DECL:
                    break;
                case InstType.BIN_OP:
                    this._handle_bin_op(inst.args.type,
                                        this.stack.pop(),
                                        this.stack.pop()
                    );
                    break;
                case InstType.CALL:
                    target = this.stack.pop();
                    args = [];
                    for (let i = 0; i < inst.args.arg_count; i++) {
                        args.push(this.stack.pop());
                    }
                    target.get_attrib('_invoke')(this, null, args);
                    break;
                case InstType.ITER:
                    break;
                case InstType.ITER_FULL:
                    break;
                case InstType.ITER_NEXT:
                    break;
                case InstType.JUMP:
                    pos = obj.get_label(inst.args.label);
                    break;
                case InstType.JUMP_IF_FALSE:
                    if (this.stack.pop() == lib.hassiumFalse) {
                        pos = obj.get_label(inst.args.label);
                    }
                    break;
                case InstType.JUMP_IF_TRUE:
                    if (this.stack.pop() == lib.hassiumTrue) {
                        pos = obj.get_label(inst.args.label);
                    }
                    break;
                case InstType.LOAD_ATTRIB:
                    target = this.stack.pop();
                    target.get_attrib(inst.args.attrib);
                    break;
                case InstType.LOAD_CONST:
                    this.stack.push(inst.args.val);
                    break;
                case InstType.LOAD_LOCAL_VAR:
                    this.stack.push(
                        this.stackFrame.set_var(inst.args.symbol)
                    );
                    break;
                case InstType.LOAD_GLOBAL:
                    this.stack.push(
                        this.stackFrame.set_global(inst.args.symbol);
                    );
                    break;
                case InstType.POP:
                    break;
                case InstType.PUSH:
                    this.stack.push(inst.args.obj);
                    break;
                case InstType.RETURN:
                    break;
                case InstType.STORE_ATTRIB:
                    target = this.stack.pop();
                    val = this.stack.pop();
                    target.set_attrib(inst.args.attrib, val);
                    break;
                case InstType.STORE_LOCAL_VAR:
                    val = this.stack.pop();
                    this.stackFrame.set_var(inst.args.symbol, val);
                    break;
                case InstType.STORE_GLOBAL:
                    val = this.stack.pop();
                    this.stackFrame.set_global(inst.args.symbol, val);
                    break;
                case InsType.UNARY_OP:
                    this._handle_unary_op(inst.args.type, this.stack.pop());
                    break;
            }

            pos++;
        }
    }

    _handle_bin_op(type, right, left) {

    }

    _handle_unary_op(type, target) {

    }
};

/*
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
LOAD_CONST: "load_const",
LOAD_LOCAL_VAR: "load_local_var",
POP: "pop",
PUSH: "push",
RETURN: "return",
set_attrib: "set_attrib",
STORE_CLASS_VAR: "store_class_var",
STORE_LOCAL_VAR: "store_local_var",
UNARY_OP: "unary_op"
*/
