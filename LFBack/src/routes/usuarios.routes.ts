import {Router} from "express";

import{registrarNuevoUsuario, obtenerTodosLosUsuarios, obtenerUsuarioPorId, obtenerUsuarioPorNombreDeUsuario} from "../controllers/usuarios.controller";

import{emptyFields} from "../middleware/emptyFields.middleware";
import{fechaValidate} from "../middleware/fechaValidate.middleware";
import {validateNumericParam} from "../middleware/validateNumericParam.middleware";
import {validateStringParams} from "../middleware/validateStringParams.middleware";
import {existsUsuario} from "../middleware/userExistence.middleware";


const routerUsuarios: Router = Router();

routerUsuarios.post('/users/register', emptyFields(["username", "email", "fechaNacimiento"]),fechaValidate(),registrarNuevoUsuario);

routerUsuarios.get('/users/username/:username', validateStringParams(["username"]), obtenerUsuarioPorNombreDeUsuario);

routerUsuarios.get('/users/:usuarioId', validateStringParams(["usuarioId"]), existsUsuario, obtenerUsuarioPorId);

routerUsuarios.get('/users', obtenerTodosLosUsuarios);

export default routerUsuarios;