import {getAllTemporadas, getTemporadaByFecha, getTemporadaById, createTemporada} from "../controllers/temporadas.controllers";
import {Router} from "express";
import {validateDatesInitEnd} from "../middleware/validateDatesInitEnd.middleware";
import {validateNumericParam} from "../middleware/validateNumericParam.middleware";
import {validateStringParams} from "../middleware/validateStringParams.middleware";

const routerTemporadas: Router = Router();

routerTemporadas.post("/temporadas/create", validateDatesInitEnd("fInicio", "fFin"), createTemporada);

routerTemporadas.get("/temporadas/:temporadaId", validateNumericParam("temporadaId"), getTemporadaById);

routerTemporadas.get("/temporadas/fecha/:fInicio", validateStringParams(["fInicio"]), getTemporadaByFecha);

routerTemporadas.get("/temporadas/get",getAllTemporadas);

export default routerTemporadas;