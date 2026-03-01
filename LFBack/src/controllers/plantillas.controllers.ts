import { Request, Response } from "express";
import { Op } from "sequelize";
import Plantilla from "../models/plantillas.models";
import Jugador from "../models/jugadores.model";

export async function obtenerPlantillaActual(req: Request, res: Response) {
    const equipoId = req.params.equipoId;
    const jornadaId = Number(req.params.jornadaId);

    try {
        const plantilla = await Plantilla.findAll({
            where: {
                equipoUuid: equipoId,
                jornadaInicio: { [Op.lte]: jornadaId },
                [Op.or]: [
                    { jornadaFin: null },
                    { jornadaFin: { [Op.gte]: jornadaId } }
                ]
            },
            include: [
                {
                    model: Jugador,
                    as: "Jugador",
                    attributes: [
                        "jugadorId",
                        "nombre",
                        "posicion",
                        "foto"
                    ]
                }
            ]
        });

        if (plantilla.length === 0) {
            return res.status(200).json([]);
        }

        const jugadores = plantilla.map((p: any) => p.Jugador).filter(Boolean);

        return res.status(200).json(jugadores);
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            error: "Error obteniendo plantilla"
        });
    }
}

export async function obtenerPlantillaActiva(req: Request, res: Response) {
    const equipoId = req.params.equipoId;

    try {
        const plantilla = await Plantilla.findAll({
            where: {
                equipoUuid: equipoId,
                jornadaFin: null
            },
            include: [
                {
                    model: Jugador,
                    as: "Jugador",
                    attributes: [
                        "jugadorId",
                        "nombre",
                        "posicion",
                        "foto"
                    ]
                }
            ]
        });

        if (plantilla.length === 0) {
            return res.status(200).json([]);
        }

        const jugadores = plantilla.map((p: any) => p.Jugador).filter(Boolean);

        return res.status(200).json(jugadores);
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            error: "Error obteniendo plantilla activa"
        });
    }
}
