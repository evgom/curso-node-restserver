const { request, response } = require("express");
const { ObjectId } = require('mongoose').Types;

const { Usuario, Categoria, Producto } = require("../models");
const { printReq } = require("../helpers/printReq");


const coleccionesPermitidas = [
    'categorias',
    'productos',
    'productosCategoria',
    'usuarios',
    'roles'
];

const buscarUsuarios = async( termino = '', res = response) => {
    const esMongoId = ObjectId.isValid( termino );

    if ( esMongoId ){
        const usuario = await Usuario.findById(termino);

        return res.json({
            results: usuario ? [ usuario ] : []
        });
    }

    const regex = new RegExp( termino, 'i');

    const usuarios = await Usuario.find({
        $or: [ {nombre: regex}, {correo: regex} ],
        $and: [ {estado: true} ]
    });

    return res.json({
        results: usuarios
    })
};

const buscarCategorias = async( termino = '', res = response) => {
    const esMongoId = ObjectId.isValid( termino );

    if ( esMongoId ){
        const categoria = await Categoria.findById(termino);

        return res.json({
            results: categoria ? [ categoria ] : []
        });
    }

    const regex = new RegExp( termino, 'i');

    const categorias = await Categoria.find( { nombre: regex, estado: true } );

    return res.json({
        results: categorias
    })
};

const buscarProductos = async( termino = '', res = response) => {
    const esMongoId = ObjectId.isValid( termino );

    if ( esMongoId ){
        const producto = await Producto.findById(termino)
                                .populate('usuario', 'nombre')
                                .populate('categoria', 'nombre');

        return res.json({
            results: producto ? [ producto ] : []
        });
    }

    const regex = new RegExp( termino, 'i');

    const productos = await Producto.find( {nombre: regex, estado: true} )
                                .populate('usuario', 'nombre')
                                .populate('categoria', 'nombre');

    return res.json({
        results: productos
    })
};


const buscarProductosCategoria = async( termino = '', res = response) => {
    const esMongoId = ObjectId.isValid( termino );
    let categoria;

    if ( esMongoId ){
        categoria = await Categoria.findById(termino);
    } else {
        const regex = new RegExp("^" + termino + "$", 'i');
        categoria = await Categoria.findOne( { nombre: regex } );
    }

    if ( !categoria ) {
        return res.status(400).json({
            msg: `La categoria ${ termino } no existe`
        })
    }    

    const productos = await Producto.find( { categoria: categoria._id, estado: true } )
                                .populate('usuario', 'nombre')
                                .populate('categoria', 'nombre');

    return res.json({
        results: productos
    })
};


const buscar = (req = request, res = response) => {
    printReq(req);

    const { coleccion, termino } = req.params;

    if ( !coleccionesPermitidas.includes(coleccion) ){
        return res.status(400).json({
            msg: `${coleccion}, no es una ruta válida`
        })
    }

    switch (coleccion) {
        case 'categorias':
            buscarCategorias(termino, res);
            break;
        case 'productos':
            buscarProductos(termino, res);
            break;
        case 'productosCategoria':
            buscarProductosCategoria(termino, res);
            break;
        case 'usuarios':
            buscarUsuarios(termino, res);
            break;
    
        default:
            res.status(500).json({
                msg: 'Búsqueda no implementada'
            })

            break;
    }
};

module.exports = {
    buscar
};
