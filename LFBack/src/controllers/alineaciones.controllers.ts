import { Request, Response } from "express";
import Alineacion from "../models/alineaciones.models";
import Jugador from "../models/jugadores.model";

export async function obtenerAlineacionActual(
    req: Request,
    res: Response
){

    const equipoId = req.params.equipoId;

    try{

        const alineacion = await Alineacion.findAll({
            where:{
                equipoId,
                jornadaId: 1
            },
            include:[
                {
                    model: Jugador,
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

        return res.status(200).json(alineacion);

    }catch(e){
        console.log(e);
        return res.status(500).json({
            error:"Error obteniendo alineación"
        });
    }
}