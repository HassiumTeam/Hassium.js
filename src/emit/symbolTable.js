module.exports = class SymbolTable {
    constructor() {
        this._global_scope = [];
        this._scopes = [];
        this._scopes.push(this._global_scope);

        this._next_index = 0;
    }

    enter_scope() {
        this._scopes.push({});
    }

    leave_scope() {
        this._scopes.pop();
        if (this._scopes.count == 2) {
            this._next_index = 0;
        }
    }

    get_symbol(id) {
        for (let scope of this._scopes) {
            if (scope[id] !== undefined) {
                return scope[id];
            }
        }

        return -1;
    }

    handle_symbol(id) {
        if (!this.has_symbol(id)) {
            this._scopes[this._scopes.length - 1][id] = this._next_index++;
        }
        return this.get_symbol(id);
    }

    has_symbol(id) {
        for (let scope of this._scopes) {
            if (scope[id] !== undefined) {
                return true;
            }
        }
        return false;
    }

    in_global_scope() {
        return this._scopes.length == 1;
    }
};
