class UnexpectedTokenError {
    constructor(tok) {
        this.tok = tok;
        this.toString = function() {
            return "Unexpected token with type " + tok.type + " and value \"" + tok.val + "\" at " + tok.src;
        }
    }
}

module.exports = UnexpectedTokenError;
