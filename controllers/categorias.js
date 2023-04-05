const { request, response } = require("express");
const { Categoria } = require('../models');
const { printReq } = require("../helpers/printReq");


const obtenerCategorias = async (req = request, res = response) => {
    printReq(req);

    const { limite = 5, desde = 0 } = req.query;
    const filter = { estado: true };

    const [ total, categorias ] = await Promise.all([
        Categoria.countDocuments(filter),
        Categoria.find(filter)
            .skip( Number(desde) )
            .limit( Number(limite) )
            .populate('usuario', 'nombre')
            // .then( categoria => {
            //     // console.log(categoria);
            //     return categoria;
            // })
    ])
    .catch(err => {
        console.log(err);
        return res.status(500).json({
            msg: 'Algo salió mal'
        })
    });

    res.json({
        total,
        categorias
    });
};


const obtenerCategoria = async (req = request, res = response) => {
    printReq(req);

    const filter = {
        _id: req.params.id,
        estado: true
    };

    const categoria = await Categoria.findOne(filter)
        .populate('usuario', 'nombre')
        .catch(err => {
            console.log(err);
            return res.status(500).json({
                msg: 'Algo salió mal'
            })
        });

    res.json({
        categoria
    });
};


const crearCategoria = async (req = request, res = response) => {
    const nombre = req.body.nombre.toUpperCase();

    const categoriaDB = await Categoria.findOne( {nombre} );

    if( categoriaDB ) {
        return res.status(400).json({
            msg: `La categoria ${ nombre }, ya existe`
        });
    }

    // Generar la data a guardar
    const data = {
        nombre,
        usuario: req.usuario._id
    };

    const categoria = new Categoria( data );

    // Guardar en DB
    await categoria.save();

    res.status(201).json(categoria);
};


const actualizarCategoria = async (req = request, res = response) => {
    printReq(req);

    const { id } = req.params;
    const { _id, usuario, estado, ...data } = req.body;
    data.nombre = data.nombre.toUpperCase();
    data.usuario = req.usuario._id;

    const categoria = await Categoria.findByIdAndUpdate( id, data, { new: true } );

    res.json({
        categoria
    });
}


const borrarCategoría = async (req = request, res = response) => {
    printReq(req);

    const { id } = req.params;

    const categoria = await Categoria.findByIdAndUpdate( id,
        { estado: false },
        { new: true });

    res.json({
        categoria
    });
};


module.exports = {
    crearCategoria,
    obtenerCategorias,
    obtenerCategoria,
    actualizarCategoria,
    borrarCategoría
}
