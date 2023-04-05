const { request, response } = require("express");
const { Producto, Categoria } = require('../models');

const { printReq } = require("../helpers/printReq");

const obtenerProductos = async (req = request, res = response) => {
    printReq(req);

    const { limite = 5, desde = 0 } = req.query;
    const filter = { estado: true };

    const [ total, productos ] = await Promise.all([
        Producto.countDocuments(filter),
        Producto.find(filter)
            .skip( Number(desde) )
            .limit( Number(limite) )
            .populate('usuario', 'nombre')
            .populate('categoria', 'nombre')
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
        productos
    });
};


const obtenerProducto = async (req = request, res = response) => {
    printReq(req);

    const filter = {
        _id: req.params.id,
        estado: true
    };

    const producto = await Producto.findOne(filter)
        .populate('usuario', 'nombre')
        .populate('categoria', 'nombre')
        .catch(err => {
            console.log(err);
            return res.status(500).json({
                msg: 'Algo salió mal'
            })
        });

    res.json({
        producto
    });
};


const crearProducto = async (req = request, res = response) => {
    printReq(req);

    const { _id, usuario, estado, ...data } = req.body;
    data.nombre = data.nombre.toUpperCase();
    data.categoria = data.categoria.toUpperCase();

    const productoDB = await Producto.findOne( { nombre: data.nombre } );
    
    if( productoDB ) {
        return res.status(400).json({
            msg: `El producto ${ data.nombre }, ya existe`
        });
    }
    
    // Buscar id categoria
    const categoriaDB = await Categoria.findOne( { nombre: data.categoria } );
    if (!categoriaDB) {
        return res.status(400).json({
            msg: `La categoria ${ data.categoria } no existe`
        });
    }

    // Generar la data a guardar
    data.usuario = req.usuario._id;
    data.categoria = categoriaDB._id;

    const producto = new Producto( data );

    // Guardar en DB
    await producto.save();

    res.status(201).json(producto);
};


const actualizarProducto = async (req = request, res = response) => {
    printReq(req);

    const { id } = req.params;
    const { _id, usuario, estado, ...data } = req.body;
    
    if ( data.nombre ) {
        data.nombre = data.nombre.toUpperCase();
    }
    data.usuario = req.usuario._id;

    const producto = await Producto.findByIdAndUpdate( id, data, { new: true } );

    res.json({
        producto
    });
}


const borrarProducto = async (req = request, res = response) => {
    printReq(req);

    const { id } = req.params;

    const producto = await Producto.findByIdAndUpdate( id,
        { estado: false },
        { new: true });

    res.json({
        producto
    });
};



module.exports = {
    actualizarProducto,
    borrarProducto,
    crearProducto,
    obtenerProducto,
    obtenerProductos
}