import {Response, Request} from "express";
import {fn, col, literal} from "sequelize";
import {sequelize} from "../configs/dbconnection.config";

import Equipo from "../models/equipos.models";
import Usuario from "../models/usuario.models";
import Liga from "../models/ligas.models";
import { crearLigaConEquipo } from "../services/crearLigaConEquipo.service";


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

    if(ligasDisponibles.length === 0) {
        res.status(200).json({
            error: 'No existe ninguna liga que cumpla con los criterios solicitados'
        });
        return;
    }

    res.status(200).json({ligasDisponibles});
}



export async function registrarLigaPorUnUsuario(req: Request,res: Response ){

    try{

        const usuarioId = res.locals.jwtUser.sub;

        const { nombreLiga, nombreEquipo } = req.body;

        const result = await crearLigaConEquipo({
            usuarioId,
            nombreLiga,
            nombreEquipo
        });

        return res.status(201).json(result);

    }catch(error){
        return res.status(500).json({
            error: "Error creando liga"
        });
    }
}


export async function unirseALiga(req: Request, res: Response){

    const ligaId = res.locals.ligaId;
    const usuarioId = res.locals.usuarioId;
    const nombreEquipo = req.body.nombreEquipo;

    const transaction = await sequelize.transaction();

    try {

        const equipo = await Equipo.create({
            nombre: nombreEquipo,
            usuarioId,
            ligaId
        }, { transaction });

        // aquí irá generar plantilla automática

        await transaction.commit();

        return res.status(201).json(equipo);

    } catch(e){

        await transaction.rollback();

        return res.status(500).json({
            error: "Error al unirse a la liga"
        });
    }
}
