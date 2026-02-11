import {getAllTemporadas, getTemporadaByFecha, getTemporadaById, createTemporada} from "../controllers/temporadas.controllers";
import {Router} from "express";

const routerTemporadas: Router = Router();

routerTemporadas.post("/temporadas/create", createTemporada);

routerTemporadas.get("temporadas/:id", getTemporadaById);

routerTemporadas.get("temporadas/:fInicio", getTemporadaByFecha);

routerTemporadas.get("/temporadas/get",getAllTemporadas);

export default routerTemporadas;