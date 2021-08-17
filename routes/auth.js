/*
path:'/api/login'
*/
const { Router } = require('express');
const { check } = require('express-validator')

// myexport
const { crearUsuario, login,renewToken } = require('../controllers/auth')
const { validarCampos } = require('../middlewares/validar-campos')
const { validarJWT } = require('../middlewares/validar-jwt')

const router = Router();


// Create usuario
router.post('/new', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(), 
    check('password', 'La contraseña es obligatoria').not().isEmpty(),
    check('email', 'Correo es obligatorio').isEmail(),
    validarCampos
], crearUsuario);


router.post('/',[
    check('email', 'El nombre es obligatorio').isEmail(), 
    check('password', 'La contraseña es obligatoria').not().isEmpty(),
],login);

// validarJWT
router.get('/renew',validarJWT,renewToken);

module.exports = router;