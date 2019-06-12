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

    in_global_scope() {
        return this.scopes[this.scopes.length - 1] == this.global_scope;
    }

    add_symbol(name) {
        this.scopes[this.scopes.length - 1][name] = this.index;
        return this.index++;
    }

    get_symbol(name) {
        if (this.get_symbol_strict(name) == -1) {
            this.add_symbol(name);
        }

        return this.get_symbol_strict(name);
    }

    get_symbol_strict(name) {
        for (let i = 0; i < this.scopes.length; i++) {
            let scope = this.scopes[i];
            if (scope.hasOwnProperty(name)) {
                return scope[name];
            }
        }

        return -1;
    }
};
