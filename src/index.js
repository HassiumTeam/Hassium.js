const Emit = require('./emit/emit');
const fs = require('fs');
const Lexer = require('./lexer');
const Parser = require('./parser');
const { Token, TokType } = require('./token');
const util = require('util');
const VM = require('./runtime/vm');

let filePath = process.argv[2];
let code = fs.readFileSync(filePath, 'utf-8');

let lexer = new Lexer(code);
let toks = lexer.run();
//console.log(toks);

let parser = new Parser(toks);
let ast = parser.parse();
//console.log(require('util').inspect(ast, { depth: null }));

let emit = new Emit(ast);
let mod = emit.compile();

//console.log(util.inspect(mod, { showHidden: false, depth: null }));

try {
    let vm = new VM(mod);
    vm.run(mod);
} catch (e) {
    console.log(e.toString());
    if (e.src) {
        console.log(`Thrown at ${e.src.row}:${e.src.col}.`);
    }
} finally {

}
