const { Token, TokType } = require('./token');

class Lexer {
    constructor(code) {
        this.code = code;
        this.pos = 0;
        this.len = this.code.length;
        this.res = [];
        this.src = {};
        this.row = 1;
        this.col = 0;
    }

    run() {
        this.wspace();
        while(this.peekc() != -1) {
            this.wspace();
            this.readtok();
        }

        return this.res;
    }

    readtok() {
        let cur = this.peekc();
        let next = this.nextc();

        if (/^[a-zA-Z]+$/.test(cur)) {
            this.readid();
            return;
        }
        else if (/^[0-9]+$/.test(cur)) {
            this.readint();
            return;
        }

        switch (cur) {
            case '+':
            case '-':
            case '/':
            case '*':
                if (next == cur) {
                    this.pushtok(TokType.OP, this.readc() + '' + this.readc());
                }
                else {
                    this.pushtok(TokType.OP, this.readc());
                }
                break;
            case '!':
                if (next == '!') {
                    this.pushtok(TokType.COMP, this.readc() + '' + this.readc());
                }
                else {
                    this.pushtok(TokType.OP, this.readc());
                }
                break;
            case '=':
                if (next == '=') {
                    this.pushtok(TokType.COMP, this.readc() + '' + this.readc());
                }
                else {
                    this.pushtok(TokType.ASSIGN, this.readc());
                }
                break;
            case '<':
            case '>':
                if (next == '=') {
                    this.pushtok(TokType.COMP, this.readc() + '' + this.readc());
                }
                else {
                    this.pushtok(TokType.COMP, this.readc());
                }
                break;
            case '(':
                this.pushtok(TokType.OPAREN, this.readc());
                break;
            case ')':
                this.pushtok(TokType.CPAREN, this.readc());
                break;
            case '{':
                this.pushtok(TokType.OBRACE, this.readc());
                break;
            case '}':
                this.pushtok(TokType.CBRACE, this.readc());
                break;
            case '[':
                this.pushtok(TokType.OSQUARE, this.readc());
                break;
            case ']':
                this.pushtok(TokType.CSQUARE, this.readc());
                break;
            case '.':
                this.pushtok(TokType.DOT, this.readc());
                break;
            case '"':
                this.readstr();
                break;
            default:
                console.log('Error unknown char ' + this.readc());
        }
    }

    pushtok(type, val) {
        this.res.push(new Token(type, val, { row: this.row, col: this.col }));
    }

     readstr() {
        this.readc(); // "
        let str = "";
        while (this.peekc() != -1 && this.peekc() != '"') {
            str += this.readc();
        }
        this.readc(); // "

        this.pushtok(TokType.STRING, str);
    }

     readid() {
        let str = "";
        while (this.peekc() != -1 && /^[0-9a-zA-Z]+$/.test(this.peekc())) {
            str += this.readc();
        }

        this.pushtok(TokType.ID, str);
    }

    readint() {
        let str = "";
        while (this.peekc() != -1 && /^[0-9]+$/.test(this.peekc())) {
            str += this.readc();
        }
        this.pushtok(TokType.INT, str);
    }

    wspace() {
        while(this.peekc() != -1 && /\s/.test(this.peekc())) {
            this.readc();
        }
    }

    peekc() {
        return this.pos < this.len ? this.code[this.pos] : -1;
    }

    nextc() {
        return (this.pos + 1) < this.len ? this.code[this.pos + 1] : -1;
    }

    readc() {
        if (this.pos < this.len) {
            if (!/\s/.test(this.peekc())) {
                this.col++;
            }
            if (this.peekc() == '\n') {
                this.row++;
                this.col = 0;
            }
            return this.code[this.pos++];
        }
        return -1;
    }
}

module.exports = Lexer;
