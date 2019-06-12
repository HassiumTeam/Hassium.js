module.exports = class SymbolTable {
    constructor() {
        this.index = 0;
        this.global_scope = {};
        this.scopes = [ this.global_scope ];
    }

    enter_scope() {
        this.scopes.push({});
    }

    leave_scope() {
        this.scopes.pop();
        if (this.scopes.length == 2) {
            this.index = 0;
        }
    }

    add_symbol(name) {
        this.scopes.peek()[name] = this.index;

        return this.index++;
    }

    get_symbol(name) {
        if (this.get_symbol_strict(name) == -1) {
            this.add_symbol(name);
        }

        return this.get_symbol_strict(name);
    }

    get_symbol_strict(name) {
        for (var scope in this.scopes) {
            if (name in scope) {
                return scope[name];
            }
        }

        return -1;
    }
};
