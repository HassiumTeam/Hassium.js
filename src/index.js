const Emit = require('./emit/emit');
const Lexer = require('./lexer');
const Parser = require('./parser');
const { Token, TokType } = require('./token');
const util = require('util');
const VM = require('./runtime/vm');

let code = '{println(2 + 3)}';

let lexer = new Lexer(code);
let toks = lexer.run();
//console.log(toks);

let parser = new Parser(toks);
let ast = parser.parse();

let emit = new Emit(ast);
let mod = emit.compile();

//console.log(util.inspect(mod, { showHidden: false, depth: null }));

let vm = new VM();
vm.run(mod);
