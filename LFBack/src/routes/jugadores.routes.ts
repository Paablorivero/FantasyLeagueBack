import { Router } from 'express';
import {getAllJugadores, getAllJugadoresByTeam, getJugadorByJugadorId} from "../controllers/jugadores.controller";

const routerJugadores: Router = Router();

routerJugadores.get("/jugadores/equipo/:equipoProfesional", getAllJugadoresByTeam);

routerJugadores.get("/jugadores/:jugadorId", getJugadorByJugadorId);

routerJugadores.get("/jugadores", getAllJugadores);

export default routerJugadores;

