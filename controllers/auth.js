const { response } = require('express');
const bcrypt = require('bcryptjs');

const {generarJWT} = require('../helpers/jwt');

const Usuario = require('../models/usuario');

const crearUsuario = async (req, res = response) => {

    const {email, password} = req.body;

    try {

        const existeEmail = await Usuario.findOne({email});
        if(existeEmail) {
            return res.status(400).json({
                ok: false,
                msg: 'El correo ya está registrado...'
            });
        }

        const usuario = new Usuario(req.body);

        // encriptar contraseña
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password, salt);

        await usuario.save();
    
        const token = await generarJWT(usuario.id);

        res.json({
            ok: true,
            usuario: usuario,
            token
        });

    } catch(error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador!!!'
        })
    }
}

const login = async (req, res = response) => {

    const {email, password} = req.body;

    try {

        const usuarioDB = await Usuario.findOne({email});
        if(!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'Email no encontrado...'
            });
        }

        //validar el password
        const validPassword = bcrypt.compareSync(password, usuarioDB.password);
        if(!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'La contraseña no es valida'
            });
        }

        // generar JWT
        const token = await generarJWT(usuarioDB.id);

        res.json({
            ok: true,
            usuario: usuarioDB,
            token: token
        })

    } catch(error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador!!!'
        })
    }
}

const renewToken = async (req, res = response) => {

    const uid = req.uid;

    const token = await generarJWT(uid);

    const usuario = await Usuario.findById(uid);

    res.json({
        ok: true,
        usuario,
        token
    })
}

module.exports = {
    crearUsuario, 
    login,
    renewToken
}

