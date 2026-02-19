import {Router} from 'express';
import {
    getAllEquiposByUsuario,
    getAllEquiposLiga,
    registrarNuevoEquipoEnUnaLiga
} from "../controllers/equipos.controllers";
import {validateStringParams} from "../middleware/validateStringParams.middleware";
import {ligaPlazasLibres} from "../middleware/ligaPlazasLibres.middleware";
import {existsUsuario} from "../middleware/userExistence.middleware";

const routerEquipos: Router = Router();

routerEquipos.post('/equipos/crear/:ligaId/:usuarioId', validateStringParams(["ligaId", "usuarioId"]), ligaPlazasLibres, existsUsuario, registrarNuevoEquipoEnUnaLiga);

routerEquipos.get('/equipos/getAll/:ligaId', validateStringParams(["ligaId"]), getAllEquiposLiga);

routerEquipos.get('/equipos/getAll/usuario/:usuarioId', validateStringParams(["usuarioId"]), existsUsuario, getAllEquiposByUsuario);

export default routerEquipos;