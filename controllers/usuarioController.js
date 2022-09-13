import Usuario from "../models/Usuario.js";
import generarId from "../helpers/generarId.js";
import generarJWT from "../helpers/generarJWT.js";
import { emailRegistro, emailOlvidePassword } from "../helpers/email.js";

const registrar = async (req, res)=>{
    //Evitar Registros Duplicados
    const { email } = req.body;
    const existeUsuario = await Usuario.findOne({email: email})

    if(existeUsuario){
        const error = new Error('Usuario ya Registrado');
        return res.status(400).json({msg: error.message})
    }

    try {
        const usuario = new Usuario(req.body);
        //console.log(usuario)
        usuario.token = generarId();
        await usuario.save()

        //Enviar el Email de confirmacion
        emailRegistro({
            email: usuario.email,
            nombre: usuario.nombre,
            token: usuario.token
        })

        res.send({msg: 'Usuario Creado Correctamente, Revisa tu email para confirmar tu cuenta'})        
    } catch (error) {
        console.log(error)
    }    
}

const autenticar = async (req, res)=>{
    const {email, password} = req.body
    
    //Comrobar si el Usuario existe
    const usuario = await Usuario.findOne({email})
    //console.log(usuario)
    if(!usuario){
        const error = new Error("El Usuario no existe")
        return res.status(404).json({msg: error.message})
    }

    //Comrobar si el Usuario esta confirmado
    if(!usuario.confirmado){
        const error = new Error("Tu cuenta no ha sido confirmada")
        return res.status(403).json({msg: error.message})
    }

    //Comrobar su password
    if(await usuario.comprobarPassword(password)){
        res.json({
            _id: usuario._id,
            nombre: usuario.nombre,
            email: usuario.email,
            token: generarJWT(usuario._id)
        })
    }else{
        const error = new Error("El password es incorrecto")
        return res.status(403).json({msg: error.message})
    }
}

const confirmar = async (req, res)=>{
    //console.log(req.params.token);
    const {token} = req.params;
    const usuarioConfirmar = await Usuario.findOne({token})    
    //console.log(usuarioConfirmar);
    if(!usuarioConfirmar){
        const error = new Error("Token No Valido")
        return res.status(403).json({msg: error.message})
    }

    try {
        usuarioConfirmar.confirmado = true
        usuarioConfirmar.token = '';
        await usuarioConfirmar.save()
        res.json({msg: "Usuario Confirmado Correctamente"})
        //console.log(usuarioConfirmar);
    } catch (error) {
        console.log(error);
    }
}

const olvidePassword = async (req, res) => {
    const {email} = req.body
    //Comrobar si el Usuario existe
    const usuario = await Usuario.findOne({email})
    //console.log(usuario)
    if(!usuario){
        const error = new Error("El Usuario no existe")
        return res.status(404).json({msg: error.message})
    }
    try {
        usuario.token = generarId()
        //console.log(usuario);
        await usuario.save();
        //Enviar Email de confoirmacion
        emailOlvidePassword({
            email: usuario.email,
            nombre: usuario.nombre,
            token: usuario.token
        })

        res.json({msg: "Hemos enviado un mensaje con las instrucciones"})
        //console.log(usuario);
    } catch (error) {
        console.log(error);
    }
}

const comprobarToken = async (req, res) => {
    const {token} = req.params;
    const tokenValido = await Usuario.findOne({token})

    if(tokenValido){
        res.json({msg: "Token valido, Usuario si Existe"})
    }else{
        const error = new Error("Token No valido")
        return res.status(404).json({msg: error.message})
    }
}

const nuevoPassword = async (req, res) => {
    const {token} = req.params;
    const {password} = req.body

    const usuario = await Usuario.findOne({token})

    if(usuario){
        usuario.password = password
        usuario.token = ''
        try {
            await usuario.save()
            res.json({msg: 'Password Modificado Correctamente'})
        } catch (error) {
            console.log(error);
        }        
    }else{
        const error = new Error("Token No valido")
        return res.status(404).json({msg: error.message})
    }
}

const perfil = async (req, res) => {
  const {usuario} = req

  res.json(usuario)
}



export {
    registrar,
    autenticar,
    confirmar,
    olvidePassword,
    comprobarToken,
    nuevoPassword,
    perfil
};