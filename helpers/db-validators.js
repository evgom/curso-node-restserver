const { Role,
    Usuario,
    Categoria,
    Producto } = require('../models');

const esRoleValido = async (rol = '') => {
    const existeRol = await Role.findOne({ rol });

    if (!existeRol) {
        throw new Error(`El rol ${rol} no está registrado en la BD`);
    }
}

const emailExiste = async (correo = '') => {
    const existeEmail = await Usuario.findOne({ correo });

    if (existeEmail) {
        throw new Error(`El correo ${ correo }, ya está registrado`);
    }
};

const existeUsuarioById = async ( id ) => {
    const existeUsuario = await Usuario.findById(id);

    if ( !existeUsuario ) {
        throw new Error(`El id no existe ${ id }`);
    }
};

const existeCategoriaById = async ( id ) => {
    const filter = {
        _id: id,
        estado: true
    }
    const existeCategoria = await Categoria.findOne(filter)

    if ( !existeCategoria ) {
        throw new Error(`El id no existe ${ id }`);
    }
};

const existeProductoById = async ( id ) => {
    const filter = {
        _id: id,
        estado: true
    }
    const existeProducto = await Producto.findOne(filter)

    if ( !existeProducto ) {
        throw new Error(`El id no existe ${ id }`);
    }
};

module.exports = {
    esRoleValido,
    emailExiste,
    existeCategoriaById,
    existeProductoById,
    existeUsuarioById
}