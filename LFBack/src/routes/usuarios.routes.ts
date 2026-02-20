import {Router} from "express";

import {
    modificarUsuario, obtenerEquiposDelUsuarioYLigas,
    obtenerTodosLosUsuarios,
    obtenerUsuarioPorId,
    obtenerUsuarioPorNombreDeUsuario
} from "../controllers/usuarios.controller";

import {validateStringParams} from "../middleware/validateStringParams.middleware";
import {userExistFromJWT} from "../middleware/userExistFromJWT.middleware";
import {adminAuthMiddleware} from "../middleware/adminAuth.middleware";

const routerUsuarios: Router = Router();

// Estos dos primeros endpoints están aquí por ahora. Una vez se implemente JWT, deberán de moverse si es necesario
// Porque registrarse y login son los dos únicos endpoints, además de la ruta de home en el front que no deben de estar
// protegidos
// routerUsuarios.post(
//     '/users/register',
//     emptyFields(["username", "email", "password", "fechaNacimiento"]),
//     fechaValidate(),
//     registrarNuevoUsuario
// );
//
// routerUsuarios.post(
//     "/users/login",
//     emptyFields(["username","password"]),
//     loginUsuario
// );

// A partir de aquí, acciones de usuario normal.

routerUsuarios.get(
    '/users/me',
    userExistFromJWT,
    obtenerUsuarioPorId
);

routerUsuarios.get(
    '/users/username/:username',
    validateStringParams(["username"]),
    obtenerUsuarioPorNombreDeUsuario
);

routerUsuarios.get('/users', adminAuthMiddleware, obtenerTodosLosUsuarios);

routerUsuarios.get('/users/equipos/participacion', userExistFromJWT, obtenerEquiposDelUsuarioYLigas);

routerUsuarios.patch('/users/me/update', userExistFromJWT, modificarUsuario);


export default routerUsuarios;