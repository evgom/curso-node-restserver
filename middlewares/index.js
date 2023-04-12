const validarArchivoSubir = require('./validar-archivo');
const validarCampos = require('./validar-campos');
const validarJWT = require('./validar-jwt');
const validaRoles = require('./validar-roles');

module.exports = {
    ...validarArchivoSubir,
    ...validarCampos,
    ...validarJWT,
    ...validaRoles
}