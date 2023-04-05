const { Router } = require('express');
const { check } = require('express-validator');

const { crearProducto,
    obtenerProductos, 
    obtenerProducto,
    borrarProducto,
    actualizarProducto} = require('../controllers/productos');

const { existeProductoById } = require('../helpers/db-validators');
const { validarJWT,
    validarCampos, 
    esAdminRole } = require('../middlewares/');


const router = Router();


// Obtener todas los productos - público
router.get('/', obtenerProductos);

// Obtener un producto por id - público
router.get('/:id', [
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existeProductoById ),
    validarCampos
], obtenerProducto );

// Crear producto - privada -  cualquier persona con un token válido
router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('categoria', 'La categoria es obligatoria').not().isEmpty(),
    validarCampos
], crearProducto);

// Actualizar producto - privado - cualquiera con token válido.
router.put('/:id', [
    validarJWT,
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existeProductoById ),
    validarCampos
], actualizarProducto);

// Borrar una producto - Admin
router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existeProductoById ),
    validarCampos
], borrarProducto);


module.exports = router;
