const { request, response } = require("express");

const esAdminRole = (req = request, res = response, next) => {
    if ( !req.usuario ){
        return res.status(500).json({
            msg: 'Se está queriendo verificar un rol, sin válidar correctamente el usuario'
        })
    }

    const { rol, nombre } = req.usuario;

    if (rol !== 'ADMIN_ROLE') {
        return res.status(401).json({
            msg: `${ nombre } no es administrador - No puede haer esto`
        })
    }

    next();
};

const tieneRole = ( ...roles ) => {
    return (req = request, res = response, next) => {
        if ( !req.usuario ){
            return res.status(500).json({
                msg: 'Se está queriendo verificar un rol, sin válidar correctamente el usuario'
            })
        }

        if ( !roles.includes(req.usuario.rol) ){
            return res.status(401).json({
                msg: `El servicio requiere uno de estos roles ${ roles }`
            })
        }

        next();
    }
};

module.exports = {
    esAdminRole,
    tieneRole
}
