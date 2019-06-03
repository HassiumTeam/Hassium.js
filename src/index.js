const { Token, TokType } = require('./token');
const Lexer = require('./lexer');
const Parser = require('./parser');

let code = "printf(2+2)\n4<=5";
let lexer = new Lexer(code);
let toks = lexer.run();

let parser = new Parser(toks);
console.log(toks);
