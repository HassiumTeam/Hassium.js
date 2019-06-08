const { NodeType } = require('./node');

module.exports = class Emit {
    constructor(ast) {
        this.ast = ast;
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
            case NodeType.INT:
                return this.accept_int(node);
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

    }

    accept_assign(node) {

    }

    accept_attrib_access(node) {

    }

    accept_bin_op(node) {

    }

    accept_block(node) {

    }

    accept_char(node) {

    }

    accept_class(node) {

    }

    accept_expr_stmt(node) {

    }

    accept_for(node) {

    }

    accept_func_call(node) {

    }

    accept_func_decl(node) {

    }

    accept_id(node) {

    }

    accept_if(node) {

    }

    accept_int(node) {

    }

    accept_return(node) {

    }

    accept_string(node) {

    }

    accept_subscript(node) {

    }

    accept_unary_op(node) {

    }

    accept_while(node) {

    }

    emit() {
        let self = this;
        this.ast.children.nodes.forEach(function(node) {
            self.accept(node);
        });
    }
};
