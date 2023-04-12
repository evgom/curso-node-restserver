const dbValidators = require('./db-validators');
const generarJWT = require('./generar-jwt');
const googleVerify = require('./subir-archivo');
const subirArchivo = require('./subir-archivo');
const printReq = require('./printReq');

module.exports = {
    ...dbValidators,
    ...generarJWT,
    ...googleVerify,
    ...subirArchivo,
    ...printReq
};