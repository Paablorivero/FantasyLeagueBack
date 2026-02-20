import {Router} from "express";

import {
    registrarNuevoUsuario, obtenerTodosLosUsuarios, obtenerUsuarioPorId, obtenerUsuarioPorNombreDeUsuario,
    loginUsuario
} from "../controllers/usuarios.controller";

import{emptyFields} from "../middleware/emptyFields.middleware";
import{fechaValidate} from "../middleware/fechaValidate.middleware";
import {validateNumericParam} from "../middleware/validateNumericParam.middleware";
import {validateStringParams} from "../middleware/validateStringParams.middleware";
import {existsUsuario} from "../middleware/userExistence.middleware";


const routerUsuarios: Router = Router();

// Estos dos primeros endpoints están aquí por ahora. Una vez se implemente JWT, deberán de moverse si es necesario
// Porque registrarse y login son los dos únicos endpoints, además de la ruta de home en el front que no deben de estar
// protegidos
routerUsuarios.post(
    '/users/register',
    emptyFields(["username", "email", "password", "fechaNacimiento"]),
    fechaValidate(),
    registrarNuevoUsuario
);

routerUsuarios.post(
    "/users/login",
    emptyFields(["username","password"]),
    loginUsuario
);

// A partir de aquí, acciones de usuario normal.

routerUsuarios.get(
    '/users/:usuarioId',
    validateStringParams(["usuarioId"]),
    existsUsuario,
    obtenerUsuarioPorId
);

routerUsuarios.get(
    '/users/username/:username',
    validateStringParams(["username"]),
    obtenerUsuarioPorNombreDeUsuario
);

routerUsuarios.get('/users', obtenerTodosLosUsuarios);


export default routerUsuarios;