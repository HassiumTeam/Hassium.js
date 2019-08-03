const compile = require('./hassiumCompiler');
const VM = require('./runtime/vm');

let file = process.argv[2];
let mod = compile({ file });

try {
    let vm = new VM(mod);
    vm.run(mod);
} catch (e) {
    console.log(e.toString());
    if (e.src) {
        console.log(`Thrown at ${e.src.row}:${e.src.col}.`);
    }
    throw e;
} finally {

}
