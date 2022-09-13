import mongoose from "mongoose";
import bcrypt from 'bcrypt'

//Paso 1.- Aca creamos el Schema
const usuarioSchema = mongoose.Schema({
    nombre:{
        type: String,
        require: true,
        trim: true
    },
    password:{
        type: String,
        require: true,
        trim: true
    },
    email:{
        type: String,
        require: true,
        trim: true,
        unique: true
    },
    token:{
        type: String
    },
    confirmado:{
        type: Boolean,
        default: false
    }
},{
    timestamps: true //Crea las columnas de createdAt y updatedAt
})

usuarioSchema.pre('save', async function(next){
    if(!this.isModified('password')){
        next();
    }
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
})

usuarioSchema.methods.comprobarPassword = async function(passwordFormulario) {
    return await bcrypt.compare(passwordFormulario, this.password)
}

//Paso 2.- Aca creamos el modelo
const Usuario = mongoose.model("Usuario", usuarioSchema); 

export default Usuario;