const { Router } = require('express');
const { check } = require('express-validator');

const { crearCategoria,
    obtenerCategorias,
    obtenerCategoria, 
    borrarCategoría,
    actualizarCategoria } = require('../controllers/categorias');
const { existeCategoriaById } = require('../helpers/db-validators');
const { validarJWT,
    validarCampos, 
    esAdminRole } = require('../middlewares/');


const router = Router();


// Obtener todas las categorías - público
router.get('/', obtenerCategorias);

// Obtener una categoría por id - público
router.get('/:id', [
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existeCategoriaById ),
    validarCampos
], obtenerCategoria );

// Crear categoría - privada -  cualquier persona con un token válido
router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos
], crearCategoria);

// Actualizar - privado - cualquiera con token válido.
router.put('/:id', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existeCategoriaById ),
    validarCampos
], actualizarCategoria);

// Borrar una categoría - Admin
router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existeCategoriaById ),
    validarCampos
], borrarCategoría);


module.exports = router;
