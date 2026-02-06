import Jugador from "../models/jugadores.model";
import { Request, Response } from "express";


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
    const idJugador = Number(req.params.jugadorId);

    if(Number.isNaN(idJugador)){
        return res.status(400).json({
            error: 'El parámetro de id del jugador debe de ser un valor numérico'
        });

    }

    const existeJugador = await Jugador.findOne({where: {jugadorId: idJugador}});

    if(!existeJugador){
        return res.status(404).json({
            error: 'El jugador buscado no existe'
        });

    }

    res.status(200).json(existeJugador);
}

export async function getAllJugadoresByTeam(req: Request, res: Response) {
    const idEquipo = Number(req.params.equipoProfesional);

    if(Number.isNaN(idEquipo)){
        return res.status(400).json({
            error: 'Se debe de insertar un id de equipo en un formato válido'
        });

    }

    const existeEquipo = await Jugador.findOne({where: {equipoProfesional: idEquipo}});

    if(!existeEquipo){
        return res.status(404).json({
            error: 'No existe un equipo identificado por la id solicitada'
        });

    }

    const listadoJugadoresPorEquipo = await Jugador.findAll({where: {equipoProfesional: idEquipo}});

    res.status(200).json(listadoJugadoresPorEquipo);
}