import {Router} from 'express';
import {
    obtenerListadoDeLigas,
    obtenerListadoLigasConPlazasDisponibles,
    registrarLigaPorUnUsuario
} from "../controllers/ligas.controllers";


const routerLigas: Router = Router();

routerLigas.get("/ligas/all", obtenerListadoDeLigas);

routerLigas.get("/ligas/disponibles", obtenerListadoLigasConPlazasDisponibles);

routerLigas.post("/ligas/crear/:usuarioId", registrarLigaPorUnUsuario);


export default routerLigas;