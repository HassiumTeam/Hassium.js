const HassiumModule = require('../hassiumModule');
const hassiumNull = require('../types/hassiumNull');
const lib = require('../lib');

const ArgCountException = require('./hassiumArgCountException');
const IncorrectTypeException = require('./hassiumIncorrectTypeException');
const NoSelfReferenceException = require('./hassiumNoSelfReferenceException');
const UnknownIDException = require('./HassiumUnknownIDException');

class DefaultModule extends HassiumModule {
    constructor() {
        super('_default');
        this.set_attrib('ArgCountException', new ArgCountException());
        this.set_attrib('class', lib.types.classTypeDef);
        this.set_attrib('debug', new lib.HassiumInvokable(this, 'debug'));
        this.set_attrib('false', new lib.types.HassiumNumber(0));
        this.set_attrib('Func', lib.types.funcTypeDef);
        this.set_attrib('IncorrectTypeException', new IncorrectTypeException());
        this.set_attrib('iter', lib.types.iterTypeDef);
        this.set_attrib('list', lib.types.listTypeDef);
        this.set_attrib('io', require('../IO/io.module'));
        this.set_attrib('NoSelfReferenceException', new NoSelfReferenceException());
        this.set_attrib('null', hassiumNull);
        this.set_attrib('number', lib.types.numberTypeDef);
        this.set_attrib('object', lib.types.objectTypeDef);
        this.set_attrib('println', new lib.HassiumInvokable(this, 'default_println'));
        this.set_attrib('string', lib.types.stringTypeDef);
        this.set_attrib('true', new lib.types.HassiumNumber(1));
        this.set_attrib('type', lib.types.typeTypeDef);
        this.set_attrib('UnknownIDException', new UnknownIDException());
    }

    default_println(vm, mod, args) {
        args.forEach(x => console.log(x.toString_(vm, mod, []).val));
        return lib.hassiumNull;
    }

    debug(vm, mod, args) {
        console.log(require('util').inspect(vm._stack_frame._frames, { depth: null }));
        return lib.hassiumNull;
    }
};

module.exports = new DefaultModule();
