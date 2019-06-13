module.exports.HassiumFunc = require('./hassiumFunc')
module.exports.HassiumInvokable = require('./hassiumInvokable');
module.exports.HassiumModule = require('./hassiumModule');
module.exports.HassiumObject = require('./hassiumObject').HassiumObject;

module.exports.types = {};
module.exports.types.HassiumArray = require('./types/hassiumArray');
module.exports.types.HassiumBool = require('./types/hassiumBool');
module.exports.types.HassiumChar = require('./types/hassiumChar');
module.exports.types.hassiumFalse = new module.exports.types.HassiumBool(false);
module.exports.types.HassiumInt = require('./types/hassiumInt');
module.exports.types.HassiumString = require('./types/hassiumString');
module.exports.types.hassiumTrue = new module.exports.types.HassiumBool(true);
