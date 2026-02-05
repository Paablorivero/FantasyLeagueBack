import { Router } from 'express';
import {getAllJugadores, getAllJugadoresByTeam, getJugadorByJugadorId} from "../controllers/jugadores.controller";

const routerJugadores: Router = Router();

routerJugadores.get("/jugadores", getAllJugadores);

routerJugadores.get("/jugadores/:jugadorId", getJugadorByJugadorId);

routerJugadores.get("/jugadores/equipo/:equipoProfesional", getAllJugadoresByTeam);

export default routerJugadores;

