import { Request, Response } from "express";
import Alineacion from "../models/alineaciones.models";
import Jugador from "../models/jugadores.model";
import {guardarAlineacion} from "../services/guardarAlineacion.service";

export async function obtenerAlineacionActual(req: Request, res: Response){

    const equipoId = req.params.equipoId;
    const jornadaId = req.params.jornadaId;

    try{

        const alineacion = await Alineacion.findAll({
            where:{
                equipoId,
                jornadaId: Number(jornadaId)
            },
            include:[
                {
                    model: Jugador,
                    as: "Jugador",
                    attributes:[
                        "jugadorId",
                        "nombre",
                        "posicion",
                        "foto"
                    ]
                }
            ]
        });

        if(alineacion.length === 0){
            return res.status(404).json({
                error:"No existe alineación para este equipo"
            });
        }

        const jugadores = alineacion.map((a: any) => a.Jugador);

        return res.status(200).json(jugadores);

    }catch(e){
        console.log(e);
        return res.status(500).json({
            error:"Error obteniendo alineación"
        });
    }
}

export async function actualizarAlineacion(req: Request, res: Response){
    const equipoId = res.locals.equipoId;
    const jornadaId = Number(req.params.jornadaId);
    const { jugadores } = req.body;

    await guardarAlineacion(equipoId, jornadaId, jugadores);

    return res.status(200).json({message: "Alineación actualizada"});
}