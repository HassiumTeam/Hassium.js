class UnexpectedTokenError {
    constructor(tok, src) {
        this.tok = tok;
        this.toString = function() {
            return `Unexpected token with type "${this.tok.type}" and value "${this.tok.val}".`;
        }
    }
}

module.exports = UnexpectedTokenError;
