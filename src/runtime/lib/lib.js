module.exports.HassiumClass = require('./hassiumClass');
module.exports.HassiumFunc = require('./hassiumFunc')
module.exports.HassiumInvokable = require('./hassiumInvokable');
module.exports.HassiumModule = require('./hassiumModule');
module.exports.HassiumObject = require('./hassiumObject').HassiumObject;

module.exports.types = {};
module.exports.types.HassiumIter = require('./types/hassiumIter');
module.exports.types.HassiumList = require('./types/hassiumList');
module.exports.types.HassiumNumber = require('./types/hassiumNumber');
module.exports.types.HassiumString = require('./types/hassiumString');

module.exports.default = require('./default/default.module');
module.exports.io = require('./io/io.module');
module.exports.hassiumFalse = module.exports.default.get_attrib('false');
module.exports.hassiumTrue = module.exports.default.get_attrib('true');
module.exports.hassiumNull = module.exports.default.get_attrib('null');
