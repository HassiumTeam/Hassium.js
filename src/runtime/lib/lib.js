module.exports.HassiumFunc = require('./hassiumFunc')
module.exports.HassiumInvokable = require('./hassiumInvokable');
module.exports.HassiumModule = require('./hassiumModule');
module.exports.HassiumObject = require('./hassiumObject').HassiumObject;

module.exports.default = require('./default/default.module');
module.exports.hassiumFalse = module.exports.default.get_attrib('false');
module.exports.hassiumTrue = module.exports.default.get_attrib('true');

module.exports.types = {};
module.exports.types.HassiumArray = require('./types/hassiumArray');
module.exports.types.HassiumNumber = require('./types/hassiumNumber');
module.exports.types.HassiumString = require('./types/hassiumString');
