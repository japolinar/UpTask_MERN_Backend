//const express = require('express') // Es con la sintaxis anterior
// OJO para que sirva el import se debe colocar en  el packege.json lo siguiente:
// "type": "module",
import express from 'express'
import conectarDB from './config/db.js'
import dotenv from 'dotenv'
import cors from 'cors'
import usuarioRoutes from './routes/usuarioRoutes.js'
import proyectoRoutes from './routes/proyectoRoutes.js'
import tareaRoutes from './routes/tareaRoutes.js'

const app = express()
app.use(express.json())
dotenv.config()
conectarDB()

//Configurar CORS
const whiteList = [process.env.FRONTEND_URL]

const corsOptions = {
    origin: function (origin, callback){
        if(whiteList.includes(origin)){
            //Puede consultar la API
            callback(null, true)
        }else{
            //No esta permitido
            callback(new Error('Error de Cors'))
        }
    }
}
console.log(corsOptions);
//app.use(cors(corsOptions));
app.use(cors()); //lo deje asi pporque me dabe error de cors

//Routing
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/proyectos', proyectoRoutes);
app.use('/api/tareas', tareaRoutes);

const PORT = process.env.PORT || 4000;

const servidor = app.listen(PORT, ()=>{
    console.log(`Servidor en el puerto ${PORT}`)
})

//Socket.IO
import { Server } from 'socket.io'

const io = new Server(servidor, {
    pingTimeout: 60000,
    cors: {
        origin: process.env.FRONTEND_URL
    }
})

io.on('connection', (socket) => {
    //console.log('Conectado a socket.io');

    //Definir los eventos de socket.io
    socket.on('abrir proyecto', (proyecto)=>{
        //console.log(proyecto);
        socket.join(proyecto);        
    })

    socket.on('nueva tarea', (tarea) =>{
        //console.log(tarea);
        const proyecto = tarea.proyecto
        socket.to(proyecto).emit('tarea agregada', tarea);        
    })

    socket.on('eliminar tarea', (tarea) =>{
        const proyecto = tarea.proyecto
        socket.to(proyecto).emit('tarea eliminada', tarea);
    })

    socket.on('actualizar tarea', tarea =>{
        const proyecto = tarea.proyecto._id
        socket.to(proyecto).emit('tarea actualizada', tarea);
    })

    socket.on('cambiar estado', tarea =>{
        const proyecto = tarea.proyecto._id
        socket.to(proyecto).emit('nuevo estado', tarea);
    })
    
})