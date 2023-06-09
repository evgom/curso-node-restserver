const { request, response } = require('express'); // Se hace para ayudar al editor a saber el tipo de dato de la respuesta


const usuariosGet = (req = request, res = response ) => {
    const {q, nombre = 'No name', apikey, page = 1, limit= 10} = req.query;


    res.json({
        msg: 'get API - controlador',
        q,
        nombre,
        apikey,
        page,
        limit
    });
}

const usuariosPost = (req = request, res = response ) => {
    const { nombre, edad } = req.body;

    res.json({
        msg: 'post API - controlador',
        nombre,
        edad
    });
}

const usuariosPut = (req = request, res = response ) => {
    const { id } = req.params;

    res.json({
        msg: 'put API - controlador',
        id
    });
}

const usuariosPatch = (req, res = response ) => {

    res.json({
        msg: 'patch API - controlador'
    });
}

const usuariosDelete = (req, res = response ) => {

    res.json({
        msg: 'delete API - controlador'
    });
}


module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosPatch,
    usuariosDelete
}
