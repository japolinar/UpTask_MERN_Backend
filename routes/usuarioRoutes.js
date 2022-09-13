import express from 'express'
import { 
    registrar, 
    autenticar, 
    confirmar, 
    olvidePassword, 
    comprobarToken, 
    nuevoPassword, 
    perfil
} from '../controllers/usuarioController.js';
import checkAuth from '../middlleware/checkAuth.js';

const router = express.Router();

//Autenticacion , Registro y Confirmacion de usuarios
router.post('/', registrar) //Crear un nuevo Usuario
router.post('/login', autenticar)
router.get('/confirmar/:token', confirmar)
router.post('/olvide-password', olvidePassword)
router.get('/olvide-password/:token', comprobarToken)
router.post('/olvide-password/:token', nuevoPassword)
//router.route('/olvide-password/:token').get(comprobarToken).post(nuevoPassword) //Tambien se puede simplificar asi

router.get('/perfil', checkAuth, perfil)


export default router;