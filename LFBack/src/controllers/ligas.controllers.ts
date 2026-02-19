import {Response, Request} from "express";
import {fn, col, literal} from "sequelize";
import sequelize from "sequelize";

import Equipo from "../models/equipos.models";
import Usuario from "../models/usuario.models";
import Liga from "../models/ligas.models";


export async function obtenerListadoDeLigas(req: Request, res: Response) {
    const listadoLigas = await Liga.findAll();

    if(listadoLigas.length === 0) {
        res.status(200).json({
            error: 'Petición correcta. No existen datos para mostrar'
        });
        return;
    }

    res.status(200).json(listadoLigas);
}

export async function obtenerListadoLigasConPlazasDisponibles(req: Request, res: Response) {
    const ligasDisponibles = await Liga.findAll({
        attributes: {
            include: [
                [sequelize.fn('COUNT', col('Equipos.equipo_id')), 'numEquipos']
            ]
        },
        include: [
            {
                model: Equipo,
                attributes: [],
                required: false, // LEFT JOIN (ligas sin equipos también cuentan)
            }
        ],
        group: ['Liga.liga_id'],
        having: literal('COUNT("Equipos"."equipo_id") < 20'),
    });

    if(!ligasDisponibles) {
        res.status(200).json({
            error: 'No existe ninguna liga que cumpla con los criterios solicitados'
        });
        return;
    }

    res.status(200).json({ligasDisponibles});
}

export async function registrarLigaPorUnUsuario(req: Request, res: Response) {
    const usuarioId = res.locals.usuarioId;

    const nombreLiga = req.body.nombre;

    const nuevaLiga = await Liga.create({
        nombreLiga,
        usuarioId
    });

    res.status(201).json(nuevaLiga);
}