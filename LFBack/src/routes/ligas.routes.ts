import {Router} from 'express';
import {
    obtenerListadoDeLigas,
    obtenerListadoLigasConPlazasDisponibles,
    registrarLigaPorUnUsuario, unirseALiga
} from "../controllers/ligas.controllers";
import {validateStringParams} from "../middleware/validateStringParams.middleware";
import {emptyFields} from "../middleware/emptyFields.middleware";
import {existsUsuario} from "../middleware/legacy/userExistence.middleware";
import {ligaExists} from "../middleware/ligaExists.middleware";
import {ligaPlazasLibres} from "../middleware/ligaPlazasLibres.middleware";


const routerLigas: Router = Router();

routerLigas.get("/ligas/all", obtenerListadoDeLigas);

routerLigas.get("/ligas/disponibles", obtenerListadoLigasConPlazasDisponibles);

routerLigas.post(
    "/ligas/crear/:usuarioId",
    validateStringParams(["usuarioId"]),
    existsUsuario,
    emptyFields(["nombre"]),
    registrarLigaPorUnUsuario
);

routerLigas.post(
    "/ligas/:ligaId/unirse/:usuarioId",
    validateStringParams(["ligaId","usuarioId"]),
    existsUsuario,
    ligaExists,
    ligaPlazasLibres,
    unirseALiga
);

export default routerLigas;