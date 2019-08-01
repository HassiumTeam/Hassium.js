class Token {
    constructor(type, val, src) {
        this.type = type;
        this.val = val;
        this.src = src;
    }
}

const TokType = {
    ASSIGN: "assign",
    CBRACE: "cbrace",
    CHAR: "char",
    COLON: "colon",
    COMMA: "comma",
    COMP: "comp",
    CPAREN: "cparen",
    CSQUARE: "csquare",
    DOT: "dot",
    ID: "id",
    NUMBER: "number",
    OBRACE: "obrace",
    OP: "op",
    OPAREN: "oparen",
    OSQUARE: "osquare",
    SEMICOLON: "semicolon",
    STRING: "string",
}

module.exports = { Token, TokType };
