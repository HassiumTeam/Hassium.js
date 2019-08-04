const compile = require('./hassiumCompiler');
const VM = require('./runtime/vm');

let file = process.argv[2];
let mod = compile({ file });


let vm = new VM(mod);
vm.run(mod);
