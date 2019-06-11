const NodeType = {
    ARRAY_DECL: "array_decl",
    ASSIGN: "assign",
    ATTRIB_ACCESS: "attrib_access",
    BIN_OP: "bin_op",
    BLOCK: "block",
    BREAK: "break",
    CHAR: "char",
    CLASS: "class",
    CONTINUE: "continue",
    EXPR_STMT: "expr_stmt",
    FOR: "for",
    FUNC_CALL: "func_call",
    FUNC_DECL: "func_dec",
    ID: "id",
    IF: "if",
    INT: "int",
    RETURN: "return",
    STRING: "string",
    SUBSCRIPT: "subscript",
    UNARY_OP: "unary_op",
    WHILE: "while",
};

const BinOpType = {
    DIV: "div",
    EQUAL: "equal",
    GREATER: "greater",
    GREATER_OR_EQUAL: "greater_or_equal",
    LESSER: "lesser",
    LESSER_OR_EQUAL: "lesser_or_equal",
    LOGICAL_AND: "logical_and",
    LOGICAL_OR: "logical_or",
    MOD: "mod",
    MUL: "mul",
    NOT_EQUAL: "not_equal",
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
