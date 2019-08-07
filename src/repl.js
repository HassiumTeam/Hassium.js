const compile = require('./hassiumCompiler');
const lib = require('./runtime/lib/lib');
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});
const VM = require('./runtime/vm');

class REPL {
    constructor() {
        this.vm = new VM(new lib.HassiumModule('_repl'));
    }

    run() {
        readline.question('> ', (source) => {
            let mod = compile({ source });
            let ret = this.vm.run(mod);

            console.log(ret);
            this.run();
        });
    }
};

module.exports = new REPL();
