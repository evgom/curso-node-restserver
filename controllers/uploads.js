const { request, response } = require("express");
const path = require('path');
const fs = require('fs');
const cloudinary = require('cloudinary').v2

const { subirArchivo, printReq } = require("../helpers");
const { Usuario, Producto } = require("../models");


cloudinary.config( process.env.CLOUDINARY_URL );



const cargarArchivo = async (req = request, res = response) => {
    printReq(req);

    // Imágenes
    await subirArchivo(req.files, undefined, 'imgs')
        .then((nombre) => {
            res.json({
                nombre
            });
        })
        .catch((msg) => {
            return res.status(400).json({
                msg
            })
        });

};

const actualizarImagen = async(req = request, res = response) => {
    printReq(req);
    
    const { id, coleccion } = req.params;

    let modelo;
    let existeError = false;


    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if( !modelo ) {
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${id}`
                })
            }
            
            break;

        case 'productos':
            modelo = await Producto.findById(id);
            if( !modelo ) {
                return res.status(400).json({
                    msg: `No existe un producto con el id ${id}`
                })
            }
            
            break;
    
        default:
            return res.status(500).json({
                msg: 'Se me olvidó validar esto'
            });
    }

    // Limpiar imágenes previas
    try {
        if ( modelo.img ){
            // Hay que borrar la imagen previa en el servidor
            const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img);
            
            if ( fs.existsSync(pathImagen) ){
                fs.unlinkSync(pathImagen);
            }
        }
    } catch (error) {
        console.log('No se pudo borrar la imagen', error);
    }

    await subirArchivo(req.files, undefined, coleccion)
    .then((nombre) => {
        modelo.img = nombre;
    })
    .catch((msg) => {
        console.log('msg', msg);
        res.status(400).json({
            msg
        })

        existeError = true
    });

    if (existeError) {
        return
    }

    modelo.save();

    res.json({
        modelo
    });
};

const mostrarImagen = async(req = request, res = response) => {
    printReq(req);

    const { id, coleccion } = req.params;

    let modelo;
    let existeError = false;


    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if( !modelo ) {
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${id}`
                })
            }
            
            break;

        case 'productos':
            modelo = await Producto.findById(id);
            if( !modelo ) {
                return res.status(400).json({
                    msg: `No existe un producto con el id ${id}`
                })
            }
            
            break;
    
        default:
            return res.status(500).json({
                msg: 'Se me olvidó validar esto'
            });
    }

    // Leer imagen
    try {
        console.log('modelo', modelo);

        if ( modelo.img ){
            // Hay que borrar la imagen previa en el servidor
            const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img);
            
            if ( fs.existsSync(pathImagen) ){
                return res.sendFile(pathImagen);
            }
        }
    } catch (error) {
        console.log('No se pudo leer la imagen', error);
    }

    // No existe imagen
    const pathImagen = path.join(__dirname, '../assets/no-image.jpg');
    return res.status(404).sendFile(pathImagen);
};


const actualizarImagenCloudinary = async(req = request, res = response) => {
    printReq(req);
    
    const { id, coleccion } = req.params;

    let modelo;
    let existeError = false;


    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if( !modelo ) {
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${id}`
                })
            }
            
            break;

        case 'productos':
            modelo = await Producto.findById(id);
            if( !modelo ) {
                return res.status(400).json({
                    msg: `No existe un producto con el id ${id}`
                })
            }
            
            break;
    
        default:
            return res.status(500).json({
                msg: 'Se me olvidó validar esto'
            });
    }

    // Limpiar imágenes previas
    try {
        if ( modelo.img ){
            const nombreArr = modelo.img.split("/");
            const nombre = nombreArr[nombreArr.length - 1];
            const [ public_id ] = nombre.split('.');

            cloudinary.uploader.destroy( public_id );
        }
    } catch (error) {
        console.log('No se pudo borrar la imagen', error);
    }
    

    const { tempFilePath } = req.files.archivo;
    const { secure_url } = await cloudinary.uploader.upload( tempFilePath );

    modelo.img = secure_url;

    modelo.save();

    res.json({
        modelo
    });
};



module.exports = {
    actualizarImagen,
    actualizarImagenCloudinary,
    cargarArchivo,
    mostrarImagen
};