const { ExpectedTokenError, UnexpectedTokenError } = require('./errors/parserErrors')
const { BinOpType, UnaryOpType, Node, NodeType } = require('./node')
const { TokType } = require('./token');

module.exports = class Parser {
    constructor(toks) {
        this.toks = toks;
        this.pos = 0;
    }

    parse() {
        let master = new Node(NodeType.BLOCK, {}, { row: 1, col: 1 });
        master.children.nodes = [];

        while (!this.eof()) {
            master.children.nodes.push(this.parse_stmt());
        }

        return master;
    }

    parse_stmt() {
        let src = this.current_src();

        let stmt;

        if (this.match_tok(TokType.OBRACE)) { stmt = this.parse_block(); }
        else if (this.accept_tok(TokType.ID, "break")) {
            stmt = new Node(NodeType.BREAK, {}, src);
        }
        else if (this.match_tok(TokType.ID, "class")) { stmt = this.parse_class(); }
        else if (this.accept_tok(TokType.ID, "continue")) {
            stmt = new Node(NodeType.CONTINUE, {}, src);
        }
        else if (this.match_tok(TokType.ID, "for")) { stmt = this.parse_for(); }
        else if (this.match_tok(TokType.ID, "foreach")) { stmt = this.parse_foreach(); }
        else if (this.match_tok(TokType.ID, "func")) { stmt = this.parse_func(); }
        else if (this.match_tok(TokType.ID, "if")) { stmt = this.parse_if(); }
        else if (this.match_tok(TokType.ID, "return")) { stmt = this.parse_return(); }
        else if (this.match_tok(TokType.ID, "while")) { stmt = this.parse_while(); }
        else {
            stmt = this.parse_expr_stmt();
        }

        this.accept_tok(TokType.SEMICOLON);

        return stmt;
    }

    parse_block() {
        let block = new Node(NodeType.BLOCK, {}, this.current_src());
        block.children.nodes = [];

        this.expect_tok(TokType.OBRACE);
        while (!this.accept_tok(TokType.CBRACE)) {
            block.children.nodes.push(this.parse_stmt());
        }

        return block;
    }

    parse_class() {
        let src = this.current_src();

        this.expect_tok(TokType.ID, "class");
        let name = this.expect_tok(TokType.ID).val;
        let extends_;
        if (this.accept_tok(TokType.ID, "extends")) {
            extends_ = this.parse_expr();
        }
        this.expect_tok(TokType.OBRACE);
        let contents = [];
        while (!this.accept_tok(TokType.CBRACE)) {
            contents.push(this.parse_stmt());
        }

        return new Node(NodeType.CLASS, { name, extends_, contents, }, src);
    }

    parse_func() {
        let src = this.current_src();

        this.expect_tok(TokType.ID, "func");
        let name = this.expect_tok(TokType.ID).val;
        let args = this.parse_arg_list();
        let body = this.parse_stmt();

        return new Node(NodeType.FUNC_DECL, { name, args, body }, src);
    }

    parse_if() {
        let src = this.current_src();

        this.expect_tok(TokType.ID, "if");
        this.expect_tok(TokType.OPAREN);
        let expr = this.parse_expr();
        this.expect_tok(TokType.CPAREN);
        let body = this.parse_stmt();

        if (this.accept_tok(TokType.ID, "else")) {
            return new Node(NodeType.IF, {
                expr,
                body,
                else_body: this.parse_stmt()
            }, src);
        }

        return new Node(NodeType.IF, { expr, body }, src);
    }

    parse_for() {
        let src = this.current_src();

        this.expect_tok(TokType.ID, "for");
        this.expect_tok(TokType.OPAREN);
        let init_stmt = this.parse_stmt();
        this.accept_tok(TokType.SEMICOLON);
        let expr = this.parse_expr();
        this.accept_tok(TokType.SEMICOLON);
        let rep_stmt = this.parse_stmt();
        this.expect_tok(TokType.CPAREN);
        let body = this.parse_stmt();

        return new Node(NodeType.FOR, {
            init_stmt, expr, rep_stmt, body
        }, src);
    }

    parse_foreach() {
        let src = this.current_src();

        this.expect_tok(TokType.ID, "foreach");
        this.expect_tok(TokType.OPAREN);
        let id = this.expect_tok(TokType.ID).val;
        this.expect_tok(TokType.ID, "in");
        let expr = this.parse_expr();
        this.expect_tok(TokType.CPAREN);
        let body = this.parse_stmt();

        return new Node(NodeType.FOREACH, {
            id, expr, body,
        }, src);
    }

    parse_return() {
        let src = this.current_src();

        this.expect_tok(TokType.ID, "return");
        let expr = this.parse_expr();

        return new Node(NodeType.RETURN, { expr }, src);
    }

    parse_while() {
        let src = this.current_src();

        this.expect_tok(TokType.ID, "while");
        this.expect_tok(TokType.OPAREN);
        let expr = this.parse_expr();
        this.expect_tok(TokType.CPAREN);
        let body = this.parse_stmt();

        return new Node(NodeType.WHILE, { expr, body }, src);
    }

    parse_expr_stmt() {
        let src = this.current_src();
        return new Node(NodeType.EXPR_STMT, { expr: this.parse_expr() }, src);
    }

    parse_expr() {
        return this.parse_assign();
    }

    parse_assign() {
        let src = this.current_src();
        let left = this.parse_or();

        if (this.match_tok(TokType.ASSIGN)) {
            switch (this.toks[this.pos].val) {
                case '=':
                    this.expect_tok(TokType.ASSIGN);
                    return new Node(NodeType.ASSIGN, {
                        left,
                        right: this.parse_assign(),
                    }, src);
                case '+=':
                    this.expect_tok(TokType.ASSIGN);
                    return new Node(NodeType.ASSIGN, {
                        left,
                        right: new Node(NodeType.BIN_OP, {
                            type: BinOpType.ADD,
                            left,
                            right: this.parse_assign(),
                        }, src)
                    }, src);
                case '&=':
                    this.expect_tok(TokType.ASSIGN);
                    return new Node(NodeType.ASSIGN, {
                        left,
                        right: new Node(NodeType.BIN_OP, {
                            left,
                            right: this.parse_assign(),
                        }, src)
                    }, src);
                case '|=':
                    this.expect_tok(TokType.ASSIGN);
                    return new Node(NodeType.ASSIGN, {
                        left,
                        right: new Node(NodeType.BIN_OP, {
                            left,
                            right: this.parse_assign(),
                        }, src)
                    }, src);
                case '/=':
                    this.expect_tok(TokType.ASSIGN);
                    return new Node(NodeType.ASSIGN, {
                        left,
                        right: new Node(NodeType.BIN_OP, {
                            left,
                            right: parse_assign(),
                        }, src)
                    }, src);
                case '%=':
                    this.expect_tok(TokType.ASSIGN);
                    return new Node(NodeType.ASSIGN, {
                        left,
                        right: new Node(NodeType.BIN_OP, {
                            left,
                            right: parse_assign(),
                        }, src)
                    }, src);
                case '*=':
                    this.expect_tok(TokType.ASSIGN);
                    return new Node(NodeType.ASSIGN, {
                        left,
                        right: new Node(NodeType.BIN_OP, {
                            left,
                            right: parse_assign(),
                        }, src)
                    }, src);
                case '-=':
                    this.expect_tok(TokType.ASSIGN);
                    return new Node(NodeType.ASSIGN, {
                        left,
                        right: new Node(NodeType.BIN_OP, {
                            type: BinOpType.SUB,
                            left,
                            right: this.parse_assign(),
                        }, src)
                    }, src);
                case '^=':
                    this.expect_tok(TokType.ASSIGN);
                    return new Node(NodeType.ASSIGN, {
                        left,
                        right: new Node(NodeType.BIN_OP, {
                            type: BinOpType.XOR,
                            left,
                            right: this.parse_assign(),
                        }, src)
                    }, src);
            }
        }

        return left;
    }

    parse_or() {
        let src = this.current_src();
        let left = this.parse_and();

        while (this.accept_tok(TokType.OP, '||')) {
            left = new Node(NodeType.BIN_OP, {
                type: BinOpType.LOGICAL_OR,
                left,
                right: this.parse_or()
            }, src);
        }

        return left;
    }

    parse_and() {
        let src = this.current_src();
        let left = this.parse_eq();

        while (this.accept_tok(TokType.OP, '&&')) {
            left = new Node(NodeType.BIN_OP, {
                type: BinOpType.LOGICAL_AND,
                left,
                right: this.parse_and()
            }, src);
        }

        return left;
    }

    parse_eq() {
        let src = this.current_src();
        let left = this.parse_comp();

        if (this.match_tok(TokType.COMP)) {
            switch (this.toks[this.pos].val) {
                case '==':
                    this.expect_tok(TokType.COMP);
                    return new Node(NodeType.BIN_OP, {
                        type: BinOpType.EQUAL,
                        left,
                        right: this.parse_eq(),
                    }, src);
                case '!=':
                    this.expect_tok(TokType.COMP);
                    return new Node(NodeType.UNARY_OP, {
                        type: UnaryOpType.LOGICAL_NOT,
                        target: new Node(NodeType.BIN_OP, {
                            type: BinOpType.EQUAL,
                            left,
                            right: this.parse_eq(),
                        }, src)
                    }, src);
            }
        }

        return left;
    }

    parse_comp() {
        let src = this.current_src();
        let left = this.parse_add();

        if (this.match_tok(TokType.COMP)) {
            switch (this.toks[this.pos].val) {
                case '>':
                    this.expect_tok(TokType.COMP);
                    return new Node(NodeType.BIN_OP, {
                        type: BinOpType.GREATER,
                        left,
                        right: this.parse_comp()
                    }, src);
                case '>=':
                    this.expect_tok(TokType.COMP);
                    return new Node(NodeType.BIN_OP, {
                        type: BinOpType.GREATER_OR_EQUAL,
                        left,
                        right: this.parse_comp()
                    }, src);
                case '<':
                    this.expect_tok(TokType.COMP);
                    return new Node(NodeType.BIN_OP, {
                        type: BinOpType.LESSER,
                        left,
                        right: this.parse_comp()
                    }, src);
                case '<=':
                    this.expect_tok(TokType.COMP);
                    return new Node(NodeType.BIN_OP, {
                        type: BinOpType.LESSER_OR_EQUAL,
                        left,
                        right: this.parse_comp()
                    }, src);
            }
        }

        return left;
    }

    parse_add() {
        let src = this.current_src();
        let left = this.parse_mult();

        if (this.match_tok(TokType.OP)) {
            switch (this.toks[this.pos].val) {
                case '+':
                    this.expect_tok(TokType.OP);
                    return new Node(NodeType.BIN_OP, {
                        type: BinOpType.ADD,
                        left,
                        right: this.parse_add()
                    }, src);
                case '-':
                    this.expect_tok(TokType.OP);
                    return new Node(NodeType.BIN_OP, {
                        type: BinOpType.SUB,
                        left,
                        right: this.parse_add()
                    }, src);
            }
        }

        return left;
    }

    parse_mult() {
        let src = this.current_src();
        let left = this.parse_unary();

        if (this.match_tok(TokType.OP)) {
            switch (this.toks[this.pos].val) {
                case '%':
                    this.expect_tok(TokType.OP);
                    return new Node(NodeType.BIN_OP, {
                        type: BinOpType.MOD,
                        left,
                        right: this.parse_mult()
                    }, src);
                case '*':
                    this.expect_tok(TokType.OP);
                    return new Node(NodeType.BIN_OP, {
                        type: BinOpType.MUL,
                        left,
                        right: this.parse_mult()
                    }, src);
                case '/':
                    this.expect_tok(TokType.OP);
                    return new Node(NodeType.BIN_OP, {
                        type: BinOpType.DIV,
                        left,
                        right: this.parse_mult()
                    }, src);
            }
        }

        return left;
    }

    parse_unary() {
        let src = this.current_src();

        if (this.match_tok(TokType.OP)) {
            switch (this.toks[this.pos].val) {
                case '!':
                    this.expect_tok(TokType.OP);
                    return new Node(NodeType.UNARY_OP, {
                        target: this.parse_unary(),
                        type: UnaryOpType.LOGICAL_NOT
                    }, src);
                case '++':
                    this.expect_tok(TokType.OP);
                    return new Node(NodeType.UNARY_OP, {
                        target: this.parse_unary(),
                        type: UnaryOpType.PRE_INC
                    }, src);
                case '--':
                    this.expect_tok(TokType.OP);
                    return new Node(Nodetype.UNARY_OP, {
                        target: this.parse_unary(),
                        type: UnaryOpType.PRE_DEC
                    }, src);
            }
        }

        return this.parse_access(null);
    }

    parse_access(left) {
        let src = this.current_src();

        if (!left) {
            return this.parse_access(this.parse_term());
        }

        if (this.accept_tok(TokType.DOT)) {
            return this.parse_access(new Node(NodeType.ATTRIB_ACCESS, {
                target: left,
                attrib: this.expect_tok(TokType.ID).val
            }, src));
        }
        else if (this.match_tok(TokType.OPAREN)) {
            return this.parse_access(new Node(NodeType.FUNC_CALL, {
                target: left,
                args: this.parse_arg_list()
            }, src));
        }
        else if (this.accept_tok(TokType.OSQUARE)) {
            let key = this.parse_expr();
            this.expect_tok(TokType.CSQUARE);
            return new Node(NodeType.SUBSCRIPT, {
                target: left,
                key
            }, src);
        }

        return left;
    }

    parse_term() {
        let src = this.current_src();
        if (this.match_tok(TokType.CHAR)) {
            return new Node(NodeType.CHAR, {
                val: this.expect_tok(TokType.CHAR).val
            });
        }
        else if (this.match_tok(TokType.NUMBER)) {
            return new Node(NodeType.NUMBER, {
                val: this.expect_tok(TokType.NUMBER).val
            }, src);
        }
        else if (this.accept_tok(TokType.OPAREN)) {
            let expr = this.parse_expr();
            this.expect_tok(TokType.CPAREN);
            return expr;
        }
        else if (this.match_tok(TokType.ID)) {
            return new Node(NodeType.ID, {
                id: this.expect_tok(TokType.ID).val
            }, src);
        }
        else if (this.match_tok(TokType.OBRACE)) {
            return this.parse_obj_decl();
        }
        else if (this.accept_tok(TokType.OSQUARE)) {
            let elements = [];
            while (!this.accept_tok(TokType.CSQUARE)) {
                elements.push(this.parse_expr());
                this.expect_tok(TokType.COMMA);
            }
            return new Node(NodeType.LIST_DECL, { elements }, src);
        }
        else if (this.match_tok(TokType.STRING)) {
            return new Node(NodeType.STRING, {
                val: this.expect_tok(TokType.STRING).val
            }, src);
        }
        else {
            throw new UnexpectedTokenError(this.toks[this.pos++], src);
        }
    }

    parse_arg_list() {
        let args = [];

        this.expect_tok(TokType.OPAREN);
        while (!this.accept_tok(TokType.CPAREN)) {
            args.push(this.parse_expr());
            this.accept_tok(TokType.COMMA);
        }

        return args;
    }

    parse_obj_decl() {
        let src = this.current_src();

        let exprs = [];
        let ids = [];
        let id;

        this.expect_tok(TokType.OBRACE);
        while (!this.accept_tok(TokType.CBRACE)) {
            id = this.expect_tok(TokType.ID).val;
            ids.push(id);

            if (this.accept_tok(TokType.COLON)) {
                exprs.push(this.parse_expr());
            } else {
                exprs.push(new Node(NodeType.ID, {
                    id
                }, src));
            }

            this.expect_tok(TokType.COMMA);
        }

        return new Node(NodeType.OBJ_DECL, {
            ids,
            exprs,
        }, src);
    }

    current_src() {
        return this.toks[this.pos].src;
    }

    match_tok(type, val = null) {
        if (this.eof()) { return false; }
        if (this.toks[this.pos].type != type) { return false; }
        if (val != null && this.toks[this.pos].val != val) { return false; }

        return true;
    }
    accept_tok(type, val = null) {
        if (!this.match_tok(type, val)) { return false; }

        this.pos++;
        return true;
    }
    expect_tok(type, val = null) {
        if (!this.match_tok(type, val)) {
            throw new ExpectedTokenError(
                type,
                val,
                this.toks[this.pos],
                this.current_src()
            );
            return null;
        }

        return this.toks[this.pos++];
    }

    eof() {
        return this.pos >= this.toks.length;
    }
};
