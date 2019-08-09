module.exports.HassiumInvokable = require('./hassiumInvokable');
module.exports.HassiumType = require('./hassiumType');
module.exports.HassiumClass = require('./hassiumClass');
module.exports.HassiumFunc = require('./hassiumFunc')
module.exports.HassiumClosure = require('./hassiumClosure');
module.exports.HassiumModule = require('./hassiumModule');
module.exports.HassiumObject = require('./hassiumObject').HassiumObject;

module.exports.types = {};
module.exports.types.HassiumIter = require('./types/hassiumIter');
module.exports.types.HassiumList = require('./types/hassiumList');
module.exports.types.HassiumNumber = require('./types/hassiumNumber');
module.exports.types.HassiumString = require('./types/hassiumString');
module.exports.types.funcTypeDef = module.exports.HassiumFunc.getType();
module.exports.types.iterTypeDef = module.exports.types.HassiumIter.getType();
module.exports.types.listTypeDef = module.exports.types.HassiumList.getType();
module.exports.types.numberTypeDef = module.exports.types.HassiumNumber.getType();
module.exports.types.objectTypeDef = new module.exports.HassiumType('object');
module.exports.types.stringTypeDef = module.exports.types.HassiumString.getType();
module.exports.types.typeTypeDef = new module.exports.HassiumType('type')

module.exports.modules = {};
module.exports.modules.default = require('./default/default.module');
module.exports.modules.io = module.exports.modules.default.get_attrib('io');

module.exports.hassiumFalse = module.exports.modules.default.get_attrib('false');
module.exports.hassiumTrue = module.exports.modules.default.get_attrib('true');
module.exports.hassiumNull = module.exports.modules.default.get_attrib('null');
