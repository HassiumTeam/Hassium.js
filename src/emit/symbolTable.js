module.exports = class SymbolTable {
    constructor() {
        this.index = 0;
        this.global_scope = {};
        this.scopes = [ this.global_scope ];
    }

    add_symbol(name) {
        this.scopes.peek()[name] = this.index;
        return this.index++;
    }

    enter_scope() {
        this.scopes.push({});
    }

    get_symbol(name) {
        for (var scope in this.scopes) {
            if (name in scope) {
                return scope[name];
            }
        }

        return -1;
    }

    leave_scope() {
        this.scopes.pop();
        if (this.scopes.length == 2) {
            this.index = 0;
        }
    }
};
