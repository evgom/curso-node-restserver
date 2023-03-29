const { request, response } = require('express'); // Se hace para ayudar al editor a saber el tipo de dato de la respuesta
const bcryptjs = require('bcryptjs');

const { generarJWT } = require('../helpers/generar-jwt');
const Usuario = require('../models/usuario');

const login = async (req = request, res = response) => {

    const { correo, password } =  req.body;

    try {
        // Verificar si el email existe
        const usuario = await Usuario.findOne( {correo} );
        if ( !usuario ) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - correo'
            });
        }
        
        // Si el usuario está activo en la BD
        if ( !usuario.estado ) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - estado: false'
            });
        }

        // Verificar el password
        const validPassword = bcryptjs.compareSync( password, usuario.password );
        if ( !validPassword ) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - password'
            });
        }

        // Generar JWT
        const token = await generarJWT( usuario.id );


        res.json({
            usuario,
            token
        });
        
    } catch (error) {
        console.log(error);

        return res.status(500).json({
            msg: 'Hable con el administrador'
        })
    }
    
    
}

module.exports = {
    login
}