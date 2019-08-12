const { InstType } = require('../runtime/lib/hassiumObject');
const lib = require('../runtime/lib/lib');
const { FuncParamType, NodeType, } = require('./../node');
const SymbolTable = require('./symbolTable');

module.exports = class _emit {
    constructor(ast) {
        this.ast = ast;
        this.label_id = 0;
        this.module = new lib.HassiumObject();
        this._emit_stack = [ this.module ];
        this.table = new SymbolTable();
    }

    accept(node) {
        switch (node.type) {
            case NodeType.LIST_DECL:
                return this.accept_array_decl(node);
            case NodeType.ASSIGN:
                return this.accept_assign(node);
            case NodeType.ATTRIB_ACCESS:
                return this.accept_attrib_access(node);
            case NodeType.BIN_OP:
                return this.accept_bin_op(node);
            case NodeType.BLOCK:
                return this.accept_block(node);
            case NodeType.BREAK:
                return this.accept_break(node);
            case NodeType.CHAR:
                return this.accept_char(node);
            case NodeType.CLASS:
                return this.accept_class(node);
            case NodeType.CLOSURE:
                return this.accept_closure(node);
            case NodeType.CONTINUE:
                return this.accept_continue(node);
            case NodeType.EXPR_STMT:
                return this.accept_expr_stmt(node);
            case NodeType.FOR:
                return this.accept_for(node);
            case NodeType.FOREACH:
                return this.accept_foreach(node);
            case NodeType.FUNC_CALL:
                return this.accept_func_call(node);
            case NodeType.FUNC_DECL:
                return this.accept_func_decl(node);
            case NodeType.ID:
                return this.accept_id(node);
            case NodeType.IF:
                return this.accept_if(node);
            case NodeType.IMPORT:
                return this.accept_import(node);
            case NodeType.NUMBER:
                return this.accept_number(node);
            case NodeType.OBJ_DECL:
                return this.accept_obj_decl(node);
            case NodeType.RAISE:
                return this.accept_raise(node);
            case NodeType.RETURN:
                return this.accept_return(node);
            case NodeType.STRING:
                return this.accept_string(node);
            case NodeType.SUBSCRIPT:
                return this.accept_subscript(node);
            case NodeType.SUPER:
                return this.accept_super(node);
            case NodeType.TRY_CATCH:
                return this.accept_try_catch(node);
            case NodeType.TYPEOF:
                return this.accept_typeof(node);
            case NodeType.UNARY_OP:
                return this.accept_unary_op(node);
            case NodeType.USE:
                return this.accept_use(node);
            case NodeType.WHILE:
                return this.accept_while(node);
        }
    }

    accept_array_decl(node) {
        let count = node.children.elements.length;

        let self = this;
        node.children.elements.reverse().forEach(x => self.accept(x));
        this._emit(InstType.LIST_DECL, { count }, node.src);
    }

    accept_assign(node) {
        this.accept(node.children.right);

        let vars = [];
        let self = this;
        let left = node.children.left;
        switch (left.type) {
            case NodeType.ATTRIB_ACCESS:
                this.accept(left.children.target);
                this._emit(InstType.STORE_ATTRIB,
                    { attrib: left.children.attrib }, node.src);
                break;
            case NodeType.LIST_DECL:
                let vars = left.children.elements.map(function(x) {
                    return x.children.id;
                });
                let indices = vars.map(function(x) {
                    return self.table.handle_symbol(x);
                });

                if (this.table.in_global_scope()) {
                    this._emit(InstType.OBJ_DESTRUCTURE_GLOBAL, {
                        vars,
                        indices,
                    }, node.src);
                } else {
                    this._emit(InstType.OBJ_DESTRUCTURE_LOCAL, {
                        vars,
                        indices,
                    }, node.src);
                }
                break;
            case NodeType.SUBSCRIPT:
                this.accept(left.children.key);
                this.accept(left.children.target);
                this._emit(InstType.STORE_SUBSCRIPT, {}, node.src);
                break;
            case NodeType.ID:
                if (this.table.in_global_scope()) {
                    this._emit(InstType.STORE_GLOBAL, {
                        symbol: this.table.handle_symbol(left.children.id)
                    }, left.src);
                }
                else {
                    this._emit(InstType.STORE_LOCAL, {
                        symbol: this.table.handle_symbol(left.children.id)
                    }, left.src);
                }
                break;
        }
    }

    accept_attrib_access(node) {
        this.accept(node.children.target);
        this._emit(InstType.LOAD_ATTRIB,
            { attrib: node.children.attrib }, node.src);
    }

    accept_bin_op(node) {
        this.accept(node.children.right);
        this.accept(node.children.left);
        this._emit(InstType.BIN_OP, { type: node.children.type }, node.src);
    }

    accept_block(node, ignore_scope) {
        if (ignore_scope) {
            this.table.enter_scope();
        }

        let self = this;
        node.children.nodes.forEach(function(node) {
            self.accept(node);
        });

        if (ignore_scope) {
            this.table.leave_scope();
        }
    }

    accept_break(node) {
        this._emit(InstType.JUMP, {
            label: this._emit_peek().break_labels.pop(),
        }, node.src);
    }

    accept_class(node) {
        let clazz = new lib.HassiumClass(node.children.name, node.children.extends_);
        this._emit_peek().set_attrib(node.children.name, clazz);
        clazz.self = this._emit_peek();

        this._emit_stack.push(clazz);
        node.children.contents.forEach(x => this.accept(x));
        this._emit_stack.pop();
    }

    accept_closure(node) {
        let func = new lib.HassiumFunc(
            '_closure',
            node.children.args,
            node.children.enforced_ret,
        );

        this._emit_stack.push(func);
        this.table.enter_scope();

        this.accept(node.children.body);

        this.table.leave_scope();
        this._emit_stack.pop();

        this._emit(InstType.BUILD_CLOSURE, { func, }, node.src);
    }

    accept_continue(node) {
        this._emit(InstType.JUMP, {
            label: this._emit_peek().cont_labels.pop(),
        }, node.src);
    }

    accept_expr_stmt(node) {
        this.accept(node.children.expr);
        this._emit(InstType.POP, {}, node.src);
    }

    accept_for(node) {
        let body_label = this._next_label();
        let cont_label = this._next_label();
        let end_label = this._next_label();

        this.accept(node.children.init_stmt);
        this._emit_label(body_label);
        this.accept(node.children.expr);
        this._emit(InstType.JUMP_IF_FALSE, { label: end_label }, node.src);

        let labels = this._save_labels();
        this._emit_peek().break_labels.push(end_label);
        this._emit_peek().cont_labels.push(cont_label);
        this.accept(node.children.body);
        this._restore_labels(labels);

        this._emit_label(cont_label);
        this.accept(node.children.rep_stmt);
        this._emit(InstType.JUMP, { label: body_label }, node.src);
        this._emit_label(end_label);
    }

    accept_foreach(node) {
        this.table.enter_scope();

        let body_label = this._next_label();
        let end_label = this._next_label();
        let tmp = this.table.tmp_symbol();

        this.accept(node.children.expr);
        this._emit(InstType.ITER, {}, node.children.expr.src);
        this._emit(InstType.STORE_LOCAL, { symbol: tmp }, node.children.expr.src);
        this._emit_label(body_label);
        this._emit(InstType.LOAD_ID, { id: tmp }, node.children.body.src);
        this._emit(InstType.ITER_FULL, {}, node.children.body.src);
        this._emit(InstType.JUMP_IF_TRUE, { label: end_label }, node.children.body.src);
        this._emit(InstType.LOAD_ID, { id: tmp }, node.children.body.src);
        this._emit(InstType.ITER_NEXT, {}, node.children.body.src);
        this._emit(
            InstType.STORE_LOCAL,
            { symbol: this.table.handle_symbol(node.children.id) },
            node.children.body.src
        );

        let labels = this._save_labels();
        this._emit_peek().break_labels.push(end_label);
        this._emit_peek().cont_labels.push(body_label);
        if (node.children.body.type === NodeType.BLOCK) {
            this.accept(node.children.body, true);
        } else {
            this.accept(node.children.body);
        }
        this._restore_labels(labels);

        this._emit(InstType.JUMP, { label: body_label }, node.children.body.src);
        this._emit_label(end_label);

        this.table.leave_scope();
    }

    accept_func_call(node) {
        let self = this;
        node.children.args.reverse().forEach(function(arg) {
            self.accept(arg);
        });
        this.accept(node.children.target);
        this._emit(InstType.CALL, { arg_count: node.children.args.length }, node.src);
    }

    accept_func_decl(node) {
        let func = new lib.HassiumFunc(
            node.children.name,
            node.children.args,
            node.children.enforced_ret,
        );
        func.self = this._emit_peek();

        this._emit_peek().set_attrib(node.children.name, func);

        this._emit_stack.push(func);
        this.table.enter_scope();

        this.accept(node.children.body);

        this.table.leave_scope();
        this._emit_stack.pop();
    }

    accept_id(node) {
        let id = node.children.id;

        if (id === 'this') {
            this._emit(InstType.SELF_REFERENCE, {}, node.src);
        } else if (this.table.has_symbol(id)) {
            this._emit(InstType.LOAD_ID, { id: this.table.get_symbol(id) }, node.src);
        } else {
            this._emit(InstType.LOAD_ID, { id: node.children.id }, node.src);
        }
    }

    accept_if(node) {
        let else_label = this._next_label();
        let end_label = this._next_label();

        this.accept(node.children.expr);
        this._emit(InstType.JUMP_IF_FALSE, { label: else_label }, node.src);
        this.accept(node.children.body);
        this._emit(InstType.JUMP, { label: end_label }, node.src);
        this._emit_label(else_label);
        if (node.children.else_body) {
            this.accept(node.children.else_body);
        }
        this._emit_label(end_label);
    }

    accept_import(node) {
        this._emit(InstType.IMPORT, {
            path: node.children.path,
            name: node.children.name,
        }, node.src);
    }

    accept_number(node) {
        this._emit(InstType.LOAD_NUMBER, {
            val: Number.parseFloat(node.children.val),
        }, node.src);
    }

    accept_obj_decl(node) {
        let self = this;
        node.children.exprs.reverse().forEach(x => self.accept(x));
        this._emit(InstType.OBJ_DECL, { ids: node.children.ids }, node.src);
    }

    accept_raise(node) {
        this.accept(node.children.expr);
        this._emit(InstType.RAISE, {}, node.src);
    }

    accept_return(node) {
        this.accept(node.children.expr);
        this._emit(InstType.RETURN, {}, node.src);
    }

    accept_string(node) {
        this._emit(InstType.LOAD_STRING, {
            val: node.children.val,
        }, node.src);
    }

    accept_subscript(node) {
        this.accept(node.children.key);
        this.accept(node.children.target);
        this._emit(InstType.LOAD_SUBSCRIPT, {}, node.src);
    }

    accept_super(node) {
        let self = this;
        node.children.args.reverse().forEach(function(arg) {
            self.accept(arg);
        });
        this._emit(InstType.SUPER, { arg_count: node.children.args.length }, node.src);
    }

    accept_try_catch(node) {
        let func = new lib.HassiumFunc(
            '_closure',
            [{
                type: FuncParamType.REGULAR,
                val: node.children.exception,
            }],
            node.children.enforced_ret,
        );

        this._emit_stack.push(func);
        this.table.enter_scope();

        this.accept(node.children.catch_stmt);

        this.table.leave_scope();
        this._emit_stack.pop();

        let caught_label = this._next_label();

        this._emit(InstType.BUILD_EXCEPTION_HANDLER, { func, caught_label, }, node.src);

        this.table.enter_scope();
        this.accept(node.children.try_stmt);
        this.table.leave_scope();

        this._emit(InstType.POP_EXCEPTION_HANDLER, {}, node.src);
        this._emit_label(caught_label);
    }

    accept_typeof(node) {
        this.accept(node.children.expr);
        this._emit(InstType.TYPEOF, {}, node.src);
    }

    accept_unary_op(node) {
        this.accept(node.children.target);
        this._emit(InstType.UNARY_OP, { type: node.children.type }, node.src);
    }

    accept_use(node) {
        if (node.children.expr.type === NodeType.STRING) {
            this._emit(InstType.COMPILE_MODULE, { file: node.children.expr.children.val });
        } else {
            this.accept(node.children.expr);
        }

        let self = this;
        let indices = node.children.ids.map(x => self.table.handle_symbol(x));

        if (this.table.in_global_scope()) {
            this._emit(InstType.USE_GLOBAL, {
                ids: node.children.ids,
                indices,
            }, node.src);
        } else {
            this._emit(InstType.USE_LOCAL, {
                ids: node.children.ids,
                indices,
            }, node.src);
        }
    }

    accept_while(node) {
        let body_label = this._next_label();
        let end_label = this._next_label();

        this._emit_label(body_label);
        this.accept(node.children.expr);
        this._emit(InstType.JUMP_IF_FALSE, { label: end_label }, node.src);

        let labels = this._save_labels();
        this._emit_peek().break_labels.push(end_label);
        this._emit_peek().cont_labels.push(body_label);
        this.accept(node.children.body);
        this._restore_labels(labels);

        this._emit(InstType.JUMP, { label: body_label }, node.src);
        this._emit_label(end_label);
    }

    compile() {
        let self = this;
        this.ast.children.nodes.forEach(function(node) {
            self.accept(node);
        });
        return this.module;
    }

    _emit(type, args, src) {
        this._emit_peek()._emit(type, args, src);
    }

    _emit_label(id) {
        this._emit_peek()._emit_label(id);
    }

    _emit_peek() {
        return this._emit_stack[this._emit_stack.length - 1];
    }

    _next_label() {
        return this.label_id++;
    }

    _restore_labels(labels) {
        while (this._emit_peek().break_labels.length
                > labels.break_label_count ) {
            this._emit_peek().break_labels.pop();
        }

        while (this._emit_peek().cont_labels.length
                > labels.cont_label_count) {
            this._emit_peek().cont_labels.pop();
        }
    }

    _save_labels() {
        return {
            break_label_count: this._emit_peek().break_labels.length,
            cont_label_count: this._emit_peek().cont_labels.length,
        };
    }
};
