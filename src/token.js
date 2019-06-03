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
    COLON: "colon",
    COMMA: "comma",
    COMP: "comp",
    CPAREN: "cparen",
    CSQUARE: "csquare",
    DOT: "dot",
    ID: "id",
    INT: "int",
    OBRACE: "obrace",
    OP: "op",
    OPAREN: "oparen",
    OSQUARE: "osquare",
    STRING: "string",
}

module.exports = { Token, TokType };
