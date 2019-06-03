const { ExpectedToken, UnexpectedToken } = require('./errors/parserErrors')
const { TokType } = require('./token');

class Parser {
    constructor(toks) {
        this.toks = toks;
        this.pos = 0;
    }

    parse() {
        
    }

    matchtok(type, val = null) {
        if (eof()) { return false; }
        if (this.toks[this.pos].type != type) { return false; }
        if (val != null && this.toks[this.pos].val != val) { return false; }

        return true;
    }
    accepttok(type, val = null) {
        if (!matchtok(type, val)) { return false; }

        this.pos++;
        return true;
    }
    expecttok(type, val = null) {
        if (!matchtok(type, val)) {
            throw new ExpectedToken(type, val, this.toks[this.pos]);
            return null;
        }

        return this.toks[this.pos++];
    }

    eof() {
        return this.pos >= this.toks.length;
    }
}

module.exports = Parser;
