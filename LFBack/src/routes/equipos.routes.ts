import {Router} from 'express';
import {
    getAllEquiposByUsuario,
    getAllEquiposLiga,
    registrarNuevoEquipoEnUnaLiga
} from "../controllers/equipos.controllers";

const routerEquipos: Router = Router();

routerEquipos.post('/equipos/crear/:ligaId/:usuarioId', registrarNuevoEquipoEnUnaLiga);

routerEquipos.get('/equipos/getAll/:ligaId', getAllEquiposLiga);

routerEquipos.get('/equipos/getAll/usuario/:usuarioId', getAllEquiposByUsuario);

export default routerEquipos;