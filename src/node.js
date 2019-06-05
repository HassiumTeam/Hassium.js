const NodeType = {
    BLOCK: "block",
    IF: "if",
    WHILE: "while",
};

class Node {
    constructor(type, children, src) {
        this.type = type;
        this.children = children;
        this.src = src;
    }
};

module.exports = { NodeType, Node };
