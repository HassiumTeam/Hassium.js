module.exports = class UnhandledException {
    constructor(vm, src, e) {
        this.vm = vm;
        this.src = src;
        this.e = e;
        this.toString = function() {
            return `Unhandled exception thrown at ${src}\n\nMessage: ${e.toString_(vm, null, []).val}`;
        }
    }
};
