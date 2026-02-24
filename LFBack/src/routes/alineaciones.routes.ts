import { Router } from "express";
import { obtenerAlineacionActual } from "../controllers/alineaciones.controllers";
import { validateStringParams } from "../middleware/validateStringParams.middleware";

const routerAlineaciones = Router();

routerAlineaciones.get(
    "/alineaciones/actual/:equipoId",
    validateStringParams(["equipoId"]),
    obtenerAlineacionActual
);

export default routerAlineaciones;