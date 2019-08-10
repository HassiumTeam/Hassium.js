const compile = require('./hassiumCompiler');
const VM = require('./runtime/vm');

let file = process.argv[2];

if (file == "repl") {
    require('./repl').run();
} else {
    let mod = compile({ file });

    let vm = new VM(mod);
    vm.run(mod);
}
