const { BinOpType, UnaryOpType } = require('../node');
const { HassiumObject, InstType } = require('./lib/hassiumObject');
const lib = require('./lib/lib');
const StackFrame = require('./stackFrame');
const util = require('util');
const VMErrors = require('../errors/vmErrors');

module.exports = class VM {
    constructor (mod) {
        this._mod = mod;
        this._stack_frame = new StackFrame();
        this._import_module(lib.default);
    }

    run(obj, _args) {
        let stack = [];

        let pos = 0;
        let inst, target, val, args;

        this._import_args(obj, _args);
        while (pos < obj.instructions.length) {
            inst = obj.instructions[pos];

            switch (inst.type) {
                case InstType.ARRAY_DECL:
                    break;
                case InstType.BIN_OP:
                    this._handle_bin_op(
                        stack,
                        inst.args.type,
                    );
                    break;
                case InstType.CALL:
                    target = stack.pop();
                    args = [];
                    for (let i = 0; i < inst.args.arg_count; i++) {
                        args.push(stack.pop());
                    }
                    stack.push(target.invoke(this, this.mod, args));
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
                    if (stack.pop().val === 0) {
                        pos = obj.get_label(inst.args.label);
                    }
                    break;
                case InstType.JUMP_IF_TRUE:
                    if (stack.pop().val === 1) {
                        pos = obj.get_label(inst.args.label);
                    }
                    break;
                case InstType.LOAD_ATTRIB:
                    target = stack.pop();
                    stack.push(target.get_attrib(inst.args.attrib));
                    break;
                case InstType.LOAD_CONST:
                    stack.push(inst.args.val);
                    break;
                case InstType.LOAD_ID:
                    val = this._stack_frame.get_var(inst.args.id);
                    if (val !== undefined) {
                        stack.push(val);
                    } else {
                        val = this._stack_frame.get_global(inst.args.id);
                        if (val !== undefined) {
                            stack.push(val);
                        } else {
                            val = obj.get_attrib(inst.args.id);
                            if (val !== undefined) {
                                stack.push(val);
                            } else {
                                throw new VMErrors.UnknownIDError(inst.args.id);
                            }
                        }
                    }
                    break;
                case InstType.POP:
                    break;
                case InstType.PUSH:
                    stack.push(inst.args.obj);
                    break;
                case InstType.RETURN:
                    break;
                case InstType.SELF_REFERENCE:
                    if (obj.self !== undefined) {
                        stack.push(obj.self);
                    } else {
                        throw new VMErrors.SelfReferenceError(obj);
                    }
                    break;
                case InstType.STORE_ATTRIB:
                    target = stack.pop();
                    val = stack.pop();
                    target.set_attrib(inst.args.attrib, val);
                    break;
                case InstType.STORE_LOCAL:
                    val = stack.pop();
                    this._stack_frame.set_var(inst.args.symbol, val);
                    break;
                case InstType.STORE_GLOBAL:
                    val = stack.pop();
                    this._stack_frame.set_global(inst.args.symbol, val);
                    break;
                case InsType.UNARY_OP:
                    this._handle_unary_op(stack, inst.args.type);
                    break;
            }

            pos++;
        }
    }

    _handle_bin_op(stack, type) {
        let left = stack.pop();
        let right = stack.pop();

        switch (type) {
            case BinOpType.ADD:
                stack.push(left.get_attrib('_add').invoke(this, this.mod, [ right ]));
                break;
            case BinOpType.DIV:
                stack.push(left.get_attrib('_divide').invoke(this, this.mod, [ right ]));
                break;
            case BinOpType.EQUAL:
                stack.push(left.get_attrib('_equal').invoke(this, this.mod, [ right ]));
                break;
        }
    }

    _handle_unary_op(stack, type) {

    }

    _import_args(obj, args) {
        if (args !== undefined) {
            for (let i = 0; i < args.length; i++) {
                this._stack_frame.set_var(obj.params[i], args[i]);
            }
        }
    }

    _import_module(mod) {
        for (var key in mod._attributes) {
            if (mod._attributes.hasOwnProperty(key)) {
                this._stack_frame.set_global(key, mod._attributes[key]);
            }
        }
    }
};
