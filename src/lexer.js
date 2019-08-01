const { Token, TokType } = require('./token');

class Lexer {
    constructor(code) {
        this.code = code;
        this.pos = 0;
        this.len = this.code.length;
        this.res = [];
        this.src = {};
        this.row = 1;
        this.col = 1;
    }

    run() {
        this.whitespace();
        while(this.peek_char() != -1) {
            this.read_tok();
            this.whitespace();
        }

        return this.res;
    }

    read_tok() {
        let cur = this.peek_char();
        let next = this.next_char();

        if (/^[a-zA-Z]+$/.test(cur)) {
            this.read_id();
            return;
        }
        else if (/^[0-9]+$/.test(cur)) {
            this.read_number();
            return;
        }

        switch (cur) {
            case '+':
            case '-':
            case '/':
            case '*':
            case '%':
            case '^':
                if (next == cur) {
                    this.push_tok(TokType.OP, this.read_char() + '' + this.read_char());
                } else if (next == '=') {
                    this.push_tok(TokType.ASSIGN, this.read_char() + '' + this.read_char());
                } else {
                    this.push_tok(TokType.OP, this.read_char());
                }
                break;
            case '&':
            case '|':
                if (next == cur) {
                    this.push_tok(TokType.OP, this.read_char() + '' + this.read_char());
                } else if (next == '=') {
                    this.push_tok(TokType.ASSIGN, this.read_char() + '' + this.read_char());
                } else {
                    this.push_tok(TokType.OP, this.read_char());
                }
                break;
            case '!':
                if (next == '!' || next == '=') {
                    this.push_tok(TokType.COMP, this.read_char() + '' + this.read_char());
                } else {
                    this.push_tok(TokType.OP, this.read_char());
                }
                break;
            case '=':
                if (next == '=') {
                    this.push_tok(TokType.COMP, this.read_char() + '' + this.read_char());
                } else {
                    this.push_tok(TokType.ASSIGN, this.read_char());
                }
                break;
            case '<':
            case '>':
                if (next == '=') {
                    this.push_tok(TokType.COMP, this.read_char() + '' + this.read_char());
                } else {
                    this.push_tok(TokType.COMP, this.read_char());
                }
                break;
            case '(':
                this.push_tok(TokType.OPAREN, this.read_char());
                break;
            case ')':
                this.push_tok(TokType.CPAREN, this.read_char());
                break;
            case '{':
                this.push_tok(TokType.OBRACE, this.read_char());
                break;
            case '}':
                this.push_tok(TokType.CBRACE, this.read_char());
                break;
            case '[':
                this.push_tok(TokType.OSQUARE, this.read_char());
                break;
            case ']':
                this.push_tok(TokType.CSQUARE, this.read_char());
                break;
            case '.':
                this.push_tok(TokType.DOT, this.read_char());
                break;
            case ',':
                this.push_tok(TokType.COMMA, this.read_char());
                break;
            case ':':
                this.push_tok(TokType.COLON, this.read_char());
                break;
            case ';':
                this.push_tok(TokType.SEMICOLON, this.read_char());
                break;
            case '"':
                this.read_str();
                break;
            default:
                console.log('Error unknown char ' + this.read_char());
        }
    }

    push_tok(type, val) {
        this.res.push(new Token(type, val, { row: this.row, col: this.col }));
    }

    read_str() {
        this.read_char(); // "
        let str = "";
        while (this.peek_char() != -1 && this.peek_char() != '"') {
            str += this.read_char();
        }
        this.read_char(); // "

        this.push_tok(TokType.STRING, str);
    }

     read_id() {
        let str = "";
        while (this.peek_char() != -1 && /^[0-9a-zA-Z_]+$/.test(this.peek_char())) {
            str += this.read_char();
        }

        this.push_tok(TokType.ID, str);
    }

    read_number() {
        let str = "";
        while (this.peek_char() != -1 && /^[0-9]+$/.test(this.peek_char())) {
            str += this.read_char();
        }
        this.push_tok(TokType.NUMBER, str);
    }

    whitespace() {
        while(this.peek_char() != -1 && /\s/.test(this.peek_char())) {
            this.read_char();
        }
    }

    peek_char() {
        return this.pos < this.len ? this.code[this.pos] : -1;
    }

    next_char() {
        return (this.pos + 1) < this.len ? this.code[this.pos + 1] : -1;
    }

    read_char() {
        if (this.pos < this.len) {
            if (!/\s/.test(this.peek_char())) {
                this.col++;
            }
            if (this.peek_char() == '\n') {
                this.row++;
                this.col = 1;
            }
            return this.code[this.pos++];
        }
        return -1;
    }
}

module.exports = Lexer;
