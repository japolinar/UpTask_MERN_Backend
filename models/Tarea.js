import mongoose from "mongoose";

//Paso 1.- Aca creamos el Schema
const tareaSchema = mongoose.Schema({
    nombre: {
        type: String,
        trim:true,
        required: true
    },
    descripcion: {
        type: String,
        trim:true,
        required: true
    },
    estado: {
        type: Boolean,
        default: false
    },
    fechaEntrega:{
        type: Date,
        required:true,
        default: Date.now()
    },
    prioridad: {
        type: String,
        required: true,
        enum: ["Baja", "Media", "Alta"]
    },
    proyecto: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Proyecto"
    },
    completado:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Usuario",
        default: null
    }
},{
    timestamps: true //Crea las columnas de createdAt y updatedAt
});


//Paso 2.- Aca creamos el modelo
const Tarea = mongoose.model('Tarea', tareaSchema)

export default Tarea;