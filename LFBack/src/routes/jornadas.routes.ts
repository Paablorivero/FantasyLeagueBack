import { Router } from "express";
import {
    getAllJornadas,
    getJornadaById,
    createJornada,
    updateJornada, getJornadaByFecha,
} from "../controllers/jornadas.controllers";

const routerJornadas: Router = Router();

routerJornadas.get("/jornadas", getAllJornadas);

routerJornadas.get("/jornadas/:id", getJornadaById);

routerJornadas.post("/jornadas", createJornada);

routerJornadas.put("/jornadas/update/:id", updateJornada);

routerJornadas.get("/jornadas/fecha/:fInicio", getJornadaByFecha);

export default routerJornadas;
