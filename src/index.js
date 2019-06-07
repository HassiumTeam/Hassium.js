const { Token, TokType } = require('./token');
const Lexer = require('./lexer');
const Parser = require('./parser');
const util = require('util');

let code = "if (2 < 3) { printf() } else { scanf() }";
let lexer = new Lexer(code);
let toks = lexer.run();

let parser = new Parser(toks);
console.log(util.inspect(parser.parse(), { showHidden: false, depth: null }));

//console.log(toks);
