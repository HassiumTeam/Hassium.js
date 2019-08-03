const Emit = require('./emit/emit');
const fs = require('fs');
const Lexer = require('./lexer');
const Parser = require('./parser');
const { Token, TokType } = require('./token');
const util = require('util');

module.exports = function compile({ source, file }) {
    if (!source) {
        source = fs.readFileSync(file, 'utf-8');
    }

    let lexer = new Lexer(source);
    let toks = lexer.run();
    //console.log(toks);

    let parser = new Parser(toks);
    let ast = parser.parse();
    //console.log(require('util').inspect(ast, { depth: null }));

    let emit = new Emit(ast);
    let mod = emit.compile();
    //console.log(util.inspect(mod, { showHidden: false, depth: null }));

    return mod;
}
