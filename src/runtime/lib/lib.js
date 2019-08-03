module.exports.HassiumInvokable = require('./hassiumInvokable');
module.exports.HassiumType = require('./hassiumType');
module.exports.HassiumClass = require('./hassiumClass');
module.exports.HassiumFunc = require('./hassiumFunc')
module.exports.HassiumModule = require('./hassiumModule');
module.exports.HassiumObject = require('./hassiumObject').HassiumObject;

module.exports.types = {};
module.exports.types.HassiumIter = require('./types/hassiumIter');
module.exports.types.HassiumList = require('./types/hassiumList');
module.exports.types.HassiumNumber = require('./types/hassiumNumber');
module.exports.types.HassiumString = require('./types/hassiumString');

module.exports.modules = {};
module.exports.modules.default = require('./default/default.module');
module.exports.modules.io = require('./io/io.module');
module.exports.hassiumFalse = module.exports.modules.default.get_attrib('false');
module.exports.hassiumTrue = module.exports.modules.default.get_attrib('true');
module.exports.hassiumNull = module.exports.modules.default.get_attrib('null');

module.exports.classTypeDef = module.exports.modules.default.get_attrib('class');
module.exports.objectTypeDef = module.exports.modules.default.get_attrib('object');
module.exports.typeTypeDef = module.exports.modules.default.get_attrib('type');
