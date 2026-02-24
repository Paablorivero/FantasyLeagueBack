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
import {authMiddleware} from "../middleware/authmiddleware/auth.middleware";
import {userTeamExistsInLiga} from "../middleware/userTeamExistsInLiga.middleware";


const routerLigas: Router = Router();

routerLigas.get("/ligas/all", obtenerListadoDeLigas);

routerLigas.get("/ligas/disponibles", obtenerListadoLigasConPlazasDisponibles);

routerLigas.post(
    "/ligas",
    emptyFields(["nombreLiga", "nombreEquipo"]),
    registrarLigaPorUnUsuario
);

routerLigas.post(
    "/ligas/unirse/:ligaId",
    emptyFields(["nombreEquipo"]),
    validateStringParams(["ligaId"]),
    ligaExists,
    userTeamExistsInLiga,
    ligaPlazasLibres,
    unirseALiga
);

export default routerLigas;