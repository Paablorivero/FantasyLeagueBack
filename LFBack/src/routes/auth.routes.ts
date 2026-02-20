import { Router } from "express";
import { registrarNuevoUsuario, loginUsuario } from "../controllers/usuarios.controller";
import { emptyFields } from "../middleware/emptyFields.middleware";
import { fechaValidate } from "../middleware/fechaValidate.middleware";

const routerAuth = Router();

routerAuth.post(
    "/auth/register",
    emptyFields(["username","email","password","fechaNacimiento"]),
    fechaValidate(),
    registrarNuevoUsuario
);

routerAuth.post(
    "/auth/login",
    emptyFields(["username","password"]),
    loginUsuario
);

export default routerAuth;