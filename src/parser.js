const { ExpectedTokenError, UnexpectedTokenError } = require('./errors/parserErrors')
const { Node, NodeType } = require('./node')
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
            master.children.nodes.push(this.parseStmt());
        }

        return master;
    }

    parseStmt() {
        if (this.matchTok(TokType.OBRACE)) { return this.parseBlock(); }
        else if (this.matchTok(TokType.ID, "if")) { return this.parseIf(); }
        else if (this.matchTok(TokType.ID, "while")) { return this.parseWhile(); }
        else {
            return this.parseExp();
        }
    }

    parseBlock() {
        let block = new Node(NodeType.BLOCK, {}, this.currentSrc());
        block.children.nodes = [];

        this.expectTok(TokType.OBRACE);
        while (!this.acceptTok(TokType.CBRACE)) {
            block.children.nodes.push(this.parseStmt());
        }

        return block;
    }

    parseIf() {
        let src = this.currentSrc();

        this.expectTok(TokType.ID, "if");
        this.expectTok(TokType.OPAREN);
        let expr = this.parseExp();
        let stmt = this.parseStmt();

        if (this.acceptTok(TokType.ID, "else")) {
            return new Node(NodeType.IF, {
                expr,
                stmt,
                elsestmt: this.parseStmt()
            });
        }

        return new Node(NodeType.IF, { expr, stmt }, src);
    }

    parseWhile() {
        let src = this.currentSrc();

        this.expectTok(TokType.ID, "while");
        this.expectTok(TokType.OPAREN);
        let expr = this.parsexp();
        let stmt = this.parseStmt();

        return new Node(NodeType.WHILE, { expr, stmt }, src);
    }

    parseExp() {
        return this.parseId();
    }

    parseId() {
        let src = this.currentSrc();
        if (this.matchTok(TokType.INT)) {
            return new Node(NodeType.INT, {
                val: this.expectTok(TokType.INT).val
            }, src);
        }
        else {
            throw new UnexpectedTokenError(this.toks[this.pos++]);
        }
    }

    currentSrc() {
        return this.toks[this.pos].src;
    }

    matchTok(type, val = null) {
        if (this.eof()) { return false; }
        if (this.toks[this.pos].type != type) { return false; }
        if (val != null && this.toks[this.pos].val != val) { return false; }

        return true;
    }
    acceptTok(type, val = null) {
        if (!this.matchTok(type, val)) { return false; }

        this.pos++;
        return true;
    }
    expectTok(type, val = null) {
        if (!this.matchTok(type, val)) {
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
