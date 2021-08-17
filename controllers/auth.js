const { response } = require('express')
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt')
// models

const Usuario = require('../models/usuario');


const crearUsuario = async (req, res = response) => {

    const { email, password } = req.body;
    try {
        const existeEmail = await Usuario.findOne({ email });
        if (existeEmail) {
            return res.status(400).json({
                ok: false,
                msg: 'El correo esta registrado!'
            });
        }
        const usuario = new Usuario(req.body);
        // Encriptar contrasena
        const salt = bcrypt.genSaltSync();

        usuario.password = bcrypt.hashSync(password, salt);
        await usuario.save();

        // Generar jwt
        const token = await generarJWT(usuario.id);

        res.json({
            ok: true,
            usuario,
            token

        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ ok: false, msg: 'Hable con el administrador' })
    }

}

const login = async (req, res) => {
    const { email, password } = req.body;

    try {

        const usuarioDb = await Usuario.findOne({ email });
        if (!usuarioDb) {
            return res.status(404).json({
                ok: 'false',
                msg: 'Email no encontrado'
            })
        }
        // Validar password
        const validPasword = bcrypt.compareSync(password, usuarioDb.password);
        if (!validPasword) {
            return res.status(404).json({
                ok: 'false',
                msg: 'La contraseña no es valida'
            })
        }
            const token = await generarJWT(usuarioDb.id);


            res.json({
                ok: true,
                usuarioDb,
                token
        
            })
    } 
    catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }
   
   
}


const renewToken = async (req, res) => {

    const uid = req.uid;
    

   
    const token  =await  generarJWT(uid);
    // Obtener el usuario por el ID FIndByID()
    console.log(uid);
    const user = await Usuario.findById(uid, function (err, user) {
    if(err){
        res.status(404).json({
            ok:false,
            msg:'Invalid data'
        })
    }
    else{
        res.json({
            ok:true,
            user,
            token
            
        })
    }
    });
    // if(user){
    //     console.log(user.email);
    // }
    // res.json({
    //     ok:true,
    //     uid:req.uid
    // })
}
module.exports = {
    crearUsuario,
    login,
    renewToken
}