import Jugador from "../models/jugadores.model";
import { Request, Response } from "express";
import Equipo from "../models/equipos.models";


export async function getAllJugadores(req: Request, res: Response) {
    const listadoJugadores = await Jugador.findAll();

    if(!listadoJugadores){
        return res.status(404).json({
            error: 'No se ha encontrado ningún jugador en la base de datos'
        });
    }

    res.status(200).json(listadoJugadores);
}

export async function getJugadorByJugadorId(req: Request, res: Response) {
    const idJugador = res.locals.jugadorId;

    const existeJugador = await Jugador.findOne({where: {jugadorId: idJugador}});

    if(!existeJugador){
        return res.status(404).json({
            error: 'El jugador buscado no existe'
        });

    }

    res.status(200).json(existeJugador);
}

export async function getAllJugadoresByTeam(req: Request, res: Response) {
    const idEquipo = res.locals.equipoProfesional;

    const existeEquipo = await Equipo.findOne({where: {equipoProfesional: idEquipo}});

    if(!existeEquipo){
        return res.status(404).json({
            error: 'No existe un equipo identificado por la id solicitada'
        });

    }

    const listadoJugadoresPorEquipo = await Jugador.findAll({where: {equipoProfesional: idEquipo}});

    res.status(200).json(listadoJugadoresPorEquipo);
}