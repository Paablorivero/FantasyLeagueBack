import { Router } from "express";
import {actualizarAlineacion, obtenerAlineacionActual} from "../controllers/alineaciones.controllers";
import { validateStringParams } from "../middleware/validateStringParams.middleware";

const routerAlineaciones = Router();

routerAlineaciones.get(
    "/alineaciones/actual/:equipoId/:jornadaId",
    validateStringParams(["equipoId"]),
    obtenerAlineacionActual
);

routerAlineaciones.put(
    "/alineaciones/:equipoId/:jornadaId",
    validateStringParams(["equipoId"]),
    actualizarAlineacion
);

export default routerAlineaciones;