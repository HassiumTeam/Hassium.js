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
        let args, i, inst, key, target, val;

        this._import_args(obj, _args);
        while (pos < obj.instructions.length) {
            inst = obj.instructions[pos];

            switch (inst.type) {
                case InstType.BIN_OP:
                    this._handle_bin_op(
                        stack,
                        inst.args.type,
                    );
                    break;
                case InstType.CALL:
                    target = stack.pop();
                    args = [];
                    for (i = 0; i < inst.args.arg_count; i++) {
                        args.push(stack.pop());
                    }
                    stack.push(target.invoke(this, this._mod, args));
                    break;
                case InstType.ITER:
                    target = stack.pop().iter(this, this._mod);
                    stack.push(new lib.types.HassiumIter(target));
                    break;
                case InstType.ITER_FULL:
                    target = stack.pop();
                    stack.push(target.iter_full(this, this._mod));
                    break;
                case InstType.ITER_NEXT:
                    target = stack.pop();
                    stack.push(target.iter_next(this, this._mod));
                    break;
                case InstType.JUMP:
                    pos = obj.get_label(inst.args.label);
                    break;
                case InstType.JUMP_IF_FALSE:
                    if (!stack.pop().equal(this, this._mod, lib.hassiumTrue).val) {
                        pos = obj.get_label(inst.args.label);
                    }
                    break;
                case InstType.JUMP_IF_TRUE:
                    if (stack.pop().equal(this, this._mod, lib.hassiumTrue).val) {
                        pos = obj.get_label(inst.args.label);
                    }
                    break;

                case InstType.LIST_DECL:
                    args = [];
                    for (i = 0; i < inst.args.count; i++) {
                        args.push(stack.pop());
                    }
                    stack.push(new lib.types.HassiumList(args));
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
                                val = this._mod.get_attrib(inst.args.id);
                                if (val !== undefined) {
                                    stack.push(val);
                                } else {
                                    throw new VMErrors.UnknownIDError(
                                        inst.args.id,
                                        inst.src,
                                    );
                                }
                            }
                        }
                    }
                    break;
                case InstType.LOAD_SUBSCRIPT:
                    target = stack.pop();
                    key = stack.pop();
                    if (key instanceof lib.types.HassiumString) {
                        stack.push(target.get_attrib(key.val));
                    } else {
                        stack.push(target.index(this, this._mod, key));
                    }
                    break;
                case InstType.OBJ_DECL:
                    val = new HassiumObject();
                    for (i = 0; i < inst.args.ids.length; i++) {
                        val.set_attrib(inst.args.ids[i], stack.pop());
                    }
                    stack.push(val);
                    break;
                case InstType.POP:
                    break;
                case InstType.PUSH:
                    stack.push(inst.args.obj);
                    break;
                case InstType.RETURN:
                    return stack.pop();
                case InstType.SELF_REFERENCE:
                    if (obj.self !== undefined) {
                        stack.push(obj.self);
                    } else {
                        throw new VMErrors.SelfReferenceError(obj, inst.src);
                    }
                    break;
                case InstType.STORE_ATTRIB:
                    target = stack.pop();
                    val = stack.pop();
                    target.set_attrib(inst.args.attrib, val);
                    stack.push(val);
                    break;
                case InstType.STORE_LOCAL:
                    val = stack.pop();
                    this._stack_frame.set_var(inst.args.symbol, val);
                    stack.push(val);
                    break;
                case InstType.STORE_GLOBAL:
                    val = stack.pop();
                    this._stack_frame.set_global(inst.args.symbol, val);
                    stack.push(val);
                    break;
                case InstType.STORE_SUBSCRIPT:
                    target = stack.pop();
                    key = stack.pop();
                    val = stack.pop();
                    if (key instanceof lib.types.HassiumString) {
                        target.set_attrib(key.val, val);
                    } else {
                        target.store_index(this, this._mod, key, val);
                    }
                    stack.push(val);
                    break;
                case InstType.UNARY_OP:
                    this._handle_unary_op(stack, inst.args.type);
                    break;
            }

            pos++;
        }

        return lib.hassiumNull;
    }

    _handle_bin_op(stack, type) {
        let left = stack.pop();
        let right = stack.pop();

        switch (type) {
            case BinOpType.ADD:
                stack.push(left.add(this, this._mod, right));
                break;
            case BinOpType.DIV:
                stack.push(left.divide(this, this._mod, right));
                break;
            case BinOpType.EQUAL:
                stack.push(left.equal(this, this._mod, right));
                break;
            case BinOpType.GREATER:
                stack.push(left.greater(this, this._mod, right));
                break;
            case BinOpType.GREATER_OR_EQUAL:
                stack.push(left.greater_or_equal(this, this._mod, right));
                break;
            case BinOpType.LESSER:
                stack.push(left.lesser(this, this._mod, right));
                break;
            case BinOpType.LESSER_OR_EQUAL:
                stack.push(left.lesser_or_equal(this, this._mod, right));
                break;
            case BinOpType.LOGICAL_AND:
                stack.push(left.logical_and(this, this._mod, right));
                break;
            case BinOpType.LOGICAL_OR:
                stack.push(left.logical_or(this, this._mod, right));
                break;
            case BinOpType.MOD:
                stack.push(left.modulus(this, this._mod, right));
                break;
            case BinOpType.MUL:
                stack.push(left.multiply(this, this._mod, right));
                break;
            case BinOpType.SUB:
                stack.push(left.subtract(this, this._mod, right));
                break;
        }
    }

    _handle_unary_op(stack, type) {
        let target = stack.pop();

        switch(type) {
            case UnaryOpType.LOGICAL_NOT:
                if (target.equal(this, this._mod, lib.hassiumFalse)) {
                    stack.push(lib.hassiumTrue);
                } else {
                    stack.push(lib.hassiumFalse);
                }
                break;
        }
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
