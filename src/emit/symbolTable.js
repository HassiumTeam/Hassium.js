module.exports = class SymbolTable {
    constructor() {
        this.global_scope = [];
        this.scopes = [];
    }

    add_symbol(id) {
        this.peek_scope().push(id);
    }

    handle_symbol(id) {
        if (!this.has_symbol()) {
            this.add_symbol(id);
        }
        return id;
    }

    has_symbol(id) {
        return this.peek_scope().includes(id);
    }

    enter_scope() {
        this.scopes.push([]);
    }
    
    leave_scope() {
        this.scopes.pop();
    }

    peek_scope() {
        return this.scopes[this.scopes.length - 1];
    }
};
