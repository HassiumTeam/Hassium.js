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
        this.whiteSpace();
        while(this.peekChar() != -1) {
            this.whiteSpace();
            this.readtok();
        }

        return this.res;
    }

    readtok() {
        let cur = this.peekChar();
        let next = this.nextChar();

        if (/^[a-zA-Z]+$/.test(cur)) {
            this.readID();
            return;
        }
        else if (/^[0-9]+$/.test(cur)) {
            this.readInt();
            return;
        }

        switch (cur) {
            case '+':
            case '-':
            case '/':
            case '*':
                if (next == cur) {
                    this.pushToken(TokType.OP, this.readChar() + '' + this.readChar());
                }
                else {
                    this.pushToken(TokType.OP, this.readChar());
                }
                break;
            case '!':
                if (next == '!') {
                    this.pushToken(TokType.COMP, this.readChar() + '' + this.readChar());
                }
                else {
                    this.pushToken(TokType.OP, this.readChar());
                }
                break;
            case '=':
                if (next == '=') {
                    this.pushToken(TokType.COMP, this.readChar() + '' + this.readChar());
                }
                else {
                    this.pushToken(TokType.ASSIGN, this.readChar());
                }
                break;
            case '<':
            case '>':
                if (next == '=') {
                    this.pushToken(TokType.COMP, this.readChar() + '' + this.readChar());
                }
                else {
                    this.pushToken(TokType.COMP, this.readChar());
                }
                break;
            case '(':
                this.pushToken(TokType.OPAREN, this.readChar());
                break;
            case ')':
                this.pushToken(TokType.CPAREN, this.readChar());
                break;
            case '{':
                this.pushToken(TokType.OBRACE, this.readChar());
                break;
            case '}':
                this.pushToken(TokType.CBRACE, this.readChar());
                break;
            case '[':
                this.pushToken(TokType.OSQUARE, this.readChar());
                break;
            case ']':
                this.pushToken(TokType.CSQUARE, this.readChar());
                break;
            case '.':
                this.pushToken(TokType.DOT, this.readChar());
                break;
            case '"':
                this.readStr();
                break;
            default:
                console.log('Error unknown char ' + this.readChar());
        }
    }

    pushToken(type, val) {
        this.res.push(new Token(type, val, { row: this.row, col: this.col }));
    }

    readStr() {
        this.readChar(); // "
        let str = "";
        while (this.peekChar() != -1 && this.peekChar() != '"') {
            str += this.readChar();
        }
        this.readChar(); // "

        this.pushToken(TokType.STRING, str);
    }

     readID() {
        let str = "";
        while (this.peekChar() != -1 && /^[0-9a-zA-Z]+$/.test(this.peekChar())) {
            str += this.readChar();
        }

        this.pushToken(TokType.ID, str);
    }

    readInt() {
        let str = "";
        while (this.peekChar() != -1 && /^[0-9]+$/.test(this.peekChar())) {
            str += this.readChar();
        }
        this.pushToken(TokType.INT, str);
    }

    whiteSpace() {
        while(this.peekChar() != -1 && /\s/.test(this.peekChar())) {
            this.readChar();
        }
    }

    peekChar() {
        return this.pos < this.len ? this.code[this.pos] : -1;
    }

    nextChar() {
        return (this.pos + 1) < this.len ? this.code[this.pos + 1] : -1;
    }

    readChar() {
        if (this.pos < this.len) {
            if (!/\s/.test(this.peekChar())) {
                this.col++;
            }
            if (this.peekChar() == '\n') {
                this.row++;
                this.col = 1;
            }
            return this.code[this.pos++];
        }
        return -1;
    }
}

module.exports = Lexer;
