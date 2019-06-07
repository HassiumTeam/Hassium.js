const { ExpectedTokenError, UnexpectedTokenError } = require('./errors/parserErrors')
const { BinOpType, UnaryOpType, Node, NodeType } = require('./node')
const { TokType } = require('./token');

class Parser {
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
        if (this.match_tok(TokType.OBRACE)) { return this.parse_block(); }
        else if (this.match_tok(TokType.ID, "if")) { return this.parse_if(); }
        else if (this.match_tok(TokType.ID, "while")) { return this.parse_while(); }
        else {
            return this.parse_expr();
        }
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

    parse_if() {
        let src = this.current_src();

        this.expect_tok(TokType.ID, "if");
        this.expect_tok(TokType.OPAREN);
        let expr = this.parse_expr();
        let body = this.parse_stmt();

        if (this.accept_tok(TokType.ID, "else")) {
            return new Node(NodeType.IF, {
                expr,
                body,
                else_body: this.parse_stmt()
            });
        }

        return new Node(NodeType.IF, { expr, body }, src);
    }

    parse_for() {
        let src = this.current_src();

        this.expect_tok(TokType.ID, "for");
        this.expect_tok(TokType.OPAREN);
        let init_stmt = this.parse_stmt();
        let expr = this.parse_expr();
        let rep_stmt = this.parse_stmt();
        let body = this.parse_stmt();

        return new Node(NodeType.FOR, {
            init_stmt, expr, rep_stmt, body
        }, src);
    }

    parse_while() {
        let src = this.current_src();

        this.expect_tok(TokType.ID, "while");
        this.expect_tok(TokType.OPAREN);
        let expr = this.parse_expr();
        let body = this.parse_stmt();

        return new Node(NodeType.WHILE, { expr, body }, src);
    }

    parse_expr() {
        return this.parse_assign();
    }

    parse_mult() {
        let src = this.current_src();
        let left = this.parse_unary();

        while (this.match_tok(TokType.OP)) {

        }
    }

    parse_unary() {
        let src = this.current_src();

        if (this.match_tok(TokType.OP)) {
            switch (this.toks[this.pos].val) {
                case '!':
                    this.expect_tok(TokType.OP);
                    return new Node(NodeType.UNARY_OP, {
                        target: parse_unary(),
                        type: UnaryOpType.LOGICAL_NOT
                    }, src);
                    break;
                case '++':
                    this.expect_tok(TokType.OP);
                    return new Node(NodeType.UNARY_OP, {
                        target: parse_unary(),
                        type: UnaryOpType.PRE_INC
                    }, src);
                    break;
                case '--':
                    this.expect_tok(TokType.OP);
                    return new Node(Nodetype.UNARY_OP, {
                        target: parse_unary(),
                        type: UnaryOpType.PRE_DEC
                    }, src);
                    break;
            }
        }

        return this.parse_access();
    }

    parse_access({ left }) {
        let src = this.current_src();

        if (!left) {
            return parse_access({ left: this.parse_term() });
        }

        if (this.match_tok(TokType.OPAREN)) {
            return parse_access(new Node(NodeType.FUNC_CALL, {
                target: left,
                args: this.parse_arg_list()
            }, src));
        }
        else if (this.accept_tok(TokType.DOT)) {
            return parse_access(new Node(NodeType.ATTRIB_ACCESS, {
                target: left,
                attrib: this.expect_tok(TokType.ID).val
            }));
        }
    }

    parse_term() {
        let src = this.current_src();
        if (this.match_tok(TokType.INT)) {
            return new Node(NodeType.INT, {
                val: this.expect_tok(TokType.INT).val
            }, src);
        }
        else if (this.match_tok(TokType.OPAREN)) { return this.parse_expr(); }
        else if (this.match_tok(TokType.ID)) {
            return new Node(NodeType.ID, {
                id: expect_tok(TokType.ID).val;
            }, src);
        }
        else if (this.match_tok(TokType.STRING)) {
            return new Node(NodeType.STRING, {
                str: this.expect_tok(TokType.STRING).val;
            }, src);
        }
        else {
            throw new UnexpectedTokenError(this.toks[this.pos++]);
        }
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
            throw new ExpectedTokenError(type, val, this.toks[this.pos]);
            return null;
        }

        return this.toks[this.pos++];
    }

    eof() {
        return this.pos >= this.toks.length;
    }
}

module.exports = Parser;
