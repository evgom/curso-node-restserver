const { request, response } = require('express'); // Se hace para ayudar al editor a saber el tipo de dato de la respuesta
const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuario');


const usuariosGet = async (req = request, res = response) => {
    const { limite = 5, desde = 0 } = req.query;
    const filter = { estado: true };


    // Código secuencial, más lento
    /*const usuarios = await Usuario.find(filter)
        .skip( Number(desde) )
        .limit( Number(limite) );


    const total = await Usuario.countDocuments(filter);*/

    // Ejecutamos promesas en paralelo. En vez de usar await para cada una,
    // y esperar a que se resuelva una para ejecutar la otra, ejecutamos ambas
    // en paralelo, y esperamos a que estén las respuestas de todas.
    const [ total, usuarios ] = await Promise.all([ // Desestructurazión de arreglos.
        Usuario.countDocuments(filter),
        Usuario.find(filter)
            .skip( Number(desde) )
            .limit( Number(limite) )
    ]);


    res.json({
        total,
        usuarios
    });
}

const usuariosPost = async (req = request, res = response) => {
    const { nombre, correo, password, rol } = req.body;
    const usuario = new Usuario({ nombre, correo, password, rol });

    // Encriptar la contraseña
    usuario.password = encryptPass(password);

    // Guardar en BD
    await usuario.save();

    res.json({
        usuario
    });
}

const encryptPass = (password) => {
    const salt = bcryptjs.genSaltSync();
    return bcryptjs.hashSync( password, salt );
}

const usuariosPut = async (req = request, res = response) => {
    const { id } = req.params;
    const { _id, password, google, correo, ...resto } = req.body;

    // TODO: validar contra base de datos:
    if ( password ){
        // Encriptar la contraseña
        resto.password = encryptPass(password);
    }

    const usuario = await Usuario.findByIdAndUpdate( id, resto, { new: true } );

    res.json(usuario);
}

const usuariosPatch = (req, res = response) => {

    res.json({
        msg: 'patch API - controlador'
    });
}

const usuariosDelete = async (req, res = response) => {
    const { id } = req.params;

    // Borrado físico
    // const usuario = await Usuario.findByIdAndDelete( id );

    // Borrado lógico
    const usuario = await Usuario.findByIdAndUpdate( id,
        { estado: false },
        { new: true } );

    res.json({
        usuario
    });
}


module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosPatch,
    usuariosDelete
}
