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

let emit = new Emit(ast);
let mod = emit.compile();

console.log(util.inspect(mod, { showHidden: false, depth: null }));

let vm = new VM(mod);
vm.run(mod);
