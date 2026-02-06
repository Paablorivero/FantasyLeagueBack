import {Router} from "express";

import{registrarNuevoUsuario, obtenerTodosLosUsuarios, obtenerUsuarioPorId, obtenerUsuarioPorNombreDeUsuario} from "../controllers/usuarios.controller";

const routerUsuarios: Router = Router();

routerUsuarios.post('/users/register', registrarNuevoUsuario);

routerUsuarios.get('/users/username/:username', obtenerUsuarioPorNombreDeUsuario);

routerUsuarios.get('/users/:usuarioId', obtenerUsuarioPorId);

routerUsuarios.get('/users', obtenerTodosLosUsuarios);

export default routerUsuarios;