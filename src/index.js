const { Token, TokType } = require('./token');
const Lexer = require('./lexer');
const Parser = require('./parser');

let code = "if (2 < 3) { } else { }";
let lexer = new Lexer(code);
let toks = lexer.run();

let parser = new Parser(toks);
console.log(parser.parse());

//console.log(toks);
