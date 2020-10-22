/*
    path: api/login
*/

const {Router} = require('express');
const { check } = require('express-validator');
const {crearUsuario, login, renewToken} = require('../controllers/auth');
const {validarJWT} = require('../middlewares/validar-jwt');

const router = Router();

router.post('/new', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('email', 'El email es obligatorio').not().isEmail(),
    check('password', 'El password es obligatorio').not().isEmpty(),
], crearUsuario);


router.post('/', [
    check('email', 'El email es obligatorio').not().isEmail(),
    check('password', 'El password es obligatorio').not().isEmpty(),
], login);

router.get('/renew', validarJWT, renewToken);

module.exports = router;
 