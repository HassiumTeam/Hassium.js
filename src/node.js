const NodeType = {
    ASSIGN: "assign",
    ATTRIB_ACCESS: "attrib_access",
    BIN_OP: "bin_op",
    BLOCK: "block",
    CHAR: "char",
    CLASS: "class",
    FOR: "for",
    FUNC_CALL: "func_call",
    FUNC_DEC: "func_dec",
    ID: "id",
    IF: "if",
    INT: "int",
    RETURN: "return",
    STRING: "string",
    UNARY_OP: "unary_op",
    WHILE: "while",
};

const BinOpType = {

};

const UnaryOpType = {
    LOGICAL_NOT: "logical_not",
    POST_DEC: "post_dec",
    POST_INC: "post_inc",
    PRE_DEC: "pre_dec",
    PRE_INC: "pre_inc",
};

class Node {
    constructor(type, children, src) {
        this.type = type;
        this.children = children;
        this.src = src;
    }
};

module.exports = { BinOpType, UnaryOpType, NodeType, Node };
