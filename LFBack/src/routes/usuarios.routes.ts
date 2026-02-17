import {Router} from "express";

import{registrarNuevoUsuario, obtenerTodosLosUsuarios, obtenerUsuarioPorId, obtenerUsuarioPorNombreDeUsuario} from "../controllers/usuarios.controller";

import{emptyFields} from "../middleware/emptyFields.middleware";
import{fechaValidate} from "../middleware/fechaValidate.middleware";


const routerUsuarios: Router = Router();

routerUsuarios.post('/users/register', emptyFields(["username", "email", "fechaNacimiento"]),fechaValidate(),registrarNuevoUsuario);

routerUsuarios.get('/users/username/:username', obtenerUsuarioPorNombreDeUsuario);

routerUsuarios.get('/users/:usuarioId', obtenerUsuarioPorId);

routerUsuarios.get('/users', obtenerTodosLosUsuarios);

export default routerUsuarios;