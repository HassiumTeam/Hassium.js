const { InstType } = require('../runtime/lib/hassiumObject');
const lib = require('../runtime/lib/lib');
const { NodeType } = require('./../node');
const SymbolTable = require('./symbolTable');

module.exports = class Emit {
    constructor(ast) {
        this.ast = ast;
        this.label_id = 0;
        this.module = new lib.HassiumObject();
        this._emit_stack = [ this.module ];
        this.table = new SymbolTable();
    }

    accept(node) {
        switch (node.type) {
            case NodeType.ARRAY_DECL:
                return this.accept_array_decl(node);
            case NodeType.ASSIGN:
                return this.accept_assign(node);
            case NodeType.ATTRIB_ACCESS:
                return this.accept_attrib_access(node);
            case NodeType.BIN_OP:
                return this.accept_bin_op(node);
            case NodeType.BLOCK:
                return this.accept_block(node);
            case NodeType.CHAR:
                return this.accept_char(node);
            case NodeType.CLASS:
                return this.accept_class(node);
            case NodeType.EXPR_STMT:
                return this.accept_expr_stmt(node);
            case NodeType.FOR:
                return this.accept_for(node);
            case NodeType.FUNC_CALL:
                return this.accept_func_call(node);
            case NodeType.FUNC_DECL:
                return this.accept_func_decl(node);
            case NodeType.ID:
                return this.accept_id(node);
            case NodeType.IF:
                return this.accept_if(node);
            case NodeType.NUMBER:
                return this.accept_number(node);
            case NodeType.RETURN:
                return this.accept_return(node);
            case NodeType.STRING:
                return this.accept_string(node);
            case NodeType.SUBSCRIPT:
                return this.accept_subscript(node);
            case NodeType.UNARY_OP:
                return this.accept_unary_op(node);
            case NodeType.WHILE:
                return this.accept_while(node);
        }
    }

    accept_array_decl(node) {
        let count = node.children.elements.count;

        let self = this;
        node.children.elements.reverse.forEach(x => self.accept(x));
        this.emit(InstType.ARRAY_DECL, { count }, node.src);
    }

    accept_assign(node) {
        this.accept(node.children.right);

        let left = node.children.left;
        switch (left.type) {
            case NodeType.ID:
                if (this.table.in_global_scope()) {
                    this.emit(InstType.STORE_GLOBAL, {
                        symbol: this.table.handle_symbol(left.children.id)
                    }, left.src);
                }
                else {
                    this.emit(InstType.STORE_LOCAL, {
                        symbol: this.table.handle_symbol(left.children.id)
                    }, left.src);
                }
                break;
        }
    }

    accept_attrib_access(node) {
        this.accept(node.children.target);
        this.emit(InstType.LOAD_ATTRIB, { attrib: node.children.attrib }, node.src);
    }

    accept_bin_op(node) {
        this.accept(node.children.right);
        this.accept(node.children.left);
        this.emit(InstType.BIN_OP, { type: node.children.type }, node.src);
    }

    accept_block(node) {
        this.table.enter_scope();

        let self = this;
        node.children.nodes.forEach(function(node) {
            self.accept(node);
        });

        this.table.leave_scope();
    }

    accept_break(node) {

    }

    accept_char(node) {
        this.emit(InstType.LOAD_CONST, {
            val: new lib.types.HassiumChar(node.children.val)
        }, node.src);
    }

    accept_class(node) {
        let clazz = new lib.HassiumClass();
        this.emit_peek().set_attrib(node.children.name, clazz);

        this._emit_stack.push(clazz);
        node.children.contents.forEach(x => this.accept(x));
        this._emit_stack.pop();
    }

    accept_continue(node) {

    }

    accept_expr_stmt(node) {
        this.accept(node.children.expr);
        this.emit(InstType.POP, {}, node.src);
    }

    accept_for(node) {
        let body_label = this.next_label();
        let end_label = this.next_label();

        this.accept(node.children.init_stmt);
        this.emit_label(body_label);
        this.accept(node.children.expr);
        this.emit(InstType.JUMP_IF_FALSE, { label: end_label }, node.src);
        this.accept(node.children.body);
        this.accept(node.children.rep_stmt);
        this.emit(InstType.JUMP, { label: body_label }, node.src);
        this.emit_label(end_label);
    }

    accept_func_call(node) {
        let self = this;
        node.children.args.reverse().forEach(function(arg) {
            self.accept(arg);
        });
        this.accept(node.children.target);
        this.emit(InstType.CALL, { arg_count: node.children.args.length }, node.src);
    }

    accept_func_decl(node) {
        let func = new lib.HassiumFunc(
            node.children.name,
            node.children.args.map(x => x.id)
        );
        this.emit_peek().set_attrib(node.children.name, func);

        node.children.args.forEach(x => func.add_param(x.children.id));
        func.self = this.emit_peek();

        this._emit_stack.push(func);
        this.table.enter_scope();
        this.accept(node.children.body);
        this.table.leave_scope();
        this._emit_stack.pop();
    }

    accept_id(node) {
        let id = node.children.id;

        if (id === 'this') {
            this.emit(InstType.SELF_REFERENCE, {}, node.src);
        } else if (this.table.has_symbol(id)) {
            this.emit(InstType.LOAD_ID, { id: this.table.get_symbol(id) });
        } else {
            this.emit(InstType.LOAD_ID, { id: node.children.id }, node.src);
        }
    }

    accept_if(node) {
        let else_label = this.next_label();
        let end_label = this.next_label();

        this.accept(node.children.expr);
        this.emit(InstType.JUMP_IF_FALSE, { label: else_label }, node.src);
        this.accept(node.children.body);
        this.emit(InstType.JUMP, { label: end_label }, node.src);
        this.emit_label(else_label);
        if (node.children.else_body) {
            this.accept(node.children.else_body);
        }
        this.emit_label(end_label);
    }

    accept_number(node) {
        this.emit(InstType.LOAD_CONST, {
            val: new lib.types.HassiumNumber(Number.parseFloat(node.children.val))
        }, node.src);
    }

    accept_return(node) {
        this.accept(node.children.expr);
        this.emit(InstType.RETURN, {}, node.src);
    }

    accept_string(node) {
        this.emit(InstType.LOAD_CONST, {
            val: new lib.types.HassiumString(node.children.val)
        }, node.src);
    }

    accept_subscript(node) {
        this.accept(node.children.val);
        this.accept(node.children.target);
        this.emit(InstType.LOAD_SUBSCRIPT, {}, node.src);
    }

    accept_unary_op(node) {
        this.accept(node.children.target);
        this.emit(InstType.UNARY_OP, { type: node.children.type }, node.src);
    }

    accept_while(node) {
        let body_label = this.next_label();
        let end_label = this.next_label();

        this.emit_label(body_label);
        this.accept(node.children.expr);
        this.emit(InstType.JUMP_IF_FALSE, { label: end_label }, node.src);
        this.accept(node.children.body);
        this.emit(InstType.JUMP, { label: body_label }, node.src);
        this.emit_label(end_label);
    }

    compile() {
        let self = this;
        this.ast.children.nodes.forEach(function(node) {
            self.accept(node);
        });
        return this.module;
    }

    emit(type, args, src) {
        this.emit_peek().emit(type, args, src);
    }

    emit_label(id) {
        this.emit_peek().emit_label(id);
    }

    emit_peek() {
        return this._emit_stack[this._emit_stack.length - 1];
    }

    next_label() {
        return this.label_id++;
    }
};
