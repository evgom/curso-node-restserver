const { request, response } = require('express'); // Se hace para ayudar al editor a saber el tipo de dato de la respuesta
const bcryptjs = require('bcryptjs');

const { generarJWT } = require('../helpers/generar-jwt');
const Usuario = require('../models/usuario');
const { googleVerify } = require('../helpers/google-verify');

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

const googleSignIn = async (req = request, res = response) => {
    const { id_token } = req.body;

    try {
        const { correo, nombre, img } = await googleVerify(id_token);

        // Referencia para saber si el correo ya existe
        let usuario = await Usuario.findOne( { correo } );

        if ( !usuario ) {
            const data = {
                nombre,
                correo,
                password: ':P',
                img,
                google: true,
                rol: 'USER_ROLE'
            }

            usuario = new Usuario( data );

            await usuario.save();
        }

        // Verificar si el usuario está activo
        if ( !usuario. estado ) {
            return res.status(401).json({
                msg: 'Hable con el administador. Usuario bloqueado.'
            })
        }

        // Generar JWT
        const token = await generarJWT( usuario.id );


        res.json({
            usuario,
            token
        })
    } catch (error) {
        console.log(error);

        res.status(400).json({
            ok: false,
            msg: 'El token no se pudo verificar'
        })
    }
}

module.exports = {
    login,
    googleSignIn
}