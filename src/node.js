const NodeType = {
    ASSIGN: "assign",
    ATTRIB_ACCESS: "attrib_access",
    BIN_OP: "bin_op",
    BLOCK: "block",
    BREAK: "break",
    CHAR: "char",
    CLASS: "class",
    CLOSURE: "closure",
    CONTINUE: "continue",
    EXPR_STMT: "expr_stmt",
    FOR: "for",
    FOREACH: "foreach",
    FUNC_CALL: "func_call",
    FUNC_DECL: "func_dec",
    ID: "id",
    IF: "if",
    IMPORT: "import",
    LIST_DECL: "array_decl",
    NUMBER: "number",
    OBJ_DECL: 'obj_decl',
    RETURN: "return",
    STRING: "string",
    SUBSCRIPT: "subscript",
    TYPEOF: "typeof",
    UNARY_OP: "unary_op",
    USE: "use",
    WHILE: "while",
};

const BinOpType = {
    ADD: "add",
    BITWISE_AND: "bitwise_and",
    BITWISE_OR: "bitwise_or",
    DIV: "div",
    EQUAL: "equal",
    GREATER: "greater",
    GREATER_OR_EQUAL: "greater_or_equal",
    INSTANCEOF: "instanceof",
    LESSER: "lesser",
    LESSER_OR_EQUAL: "lesser_or_equal",
    LOGICAL_AND: "logical_and",
    LOGICAL_OR: "logical_or",
    MOD: "mod",
    MUL: "mul",
    SUB: "sub",
    XOR: "xor",
};

const FuncParamType = {
    ENFORCED: "enforced",
    OBJECT: "object",
    REGULAR: "regular",
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

module.exports = { BinOpType, FuncParamType, Node, NodeType, UnaryOpType, };
