import {Response, Request} from "express";
import { col, literal} from "sequelize";
import {sequelize} from "../configs/dbconnection.config";
import {QueryTypes} from "sequelize";

import Equipo from "../models/equipos.models";
import Liga from "../models/ligas.models";
import { crearLigaConEquipo } from "../services/crearLigaConEquipo.service";
import {unirseLigaConEquipo} from "../services/unirseLigaConEquipo.service";
import Usuario from "../models/usuario.models";


export async function obtenerListadoDeLigas(req: Request, res: Response) {
    const listadoLigas = await Liga.findAll();

    if(listadoLigas.length === 0) {
        return res.status(200).json([]);
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
        return res.status(200).json([]);
    }

    res.status(200).json(ligasDisponibles);
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
        console.log(error);
        return res.status(500).json({
            error: "Error creando liga"
        });
    }
}


export async function unirseALiga(req: Request, res: Response){

    const ligaId = res.locals.ligaId;
    const usuarioId = res.locals.jwtUser.sub;
    const { nombreEquipo, logo} = req.body;

    try {

        const equipo = await unirseLigaConEquipo({
            nombreEquipo: nombreEquipo,
            logo,
            usuarioId,
            ligaId
        });

        return res.status(201).json(equipo.equipo);

    } catch(e){
        console.error("Error en unirseALiga:", e);

        const errorMessage = e instanceof Error ? e.message : "Error desconocido";

        if (
            errorMessage.includes("No existen jugadores suficientes") ||
            errorMessage.includes("El equipo no tiene plantilla activa")
        ) {
            return res.status(400).json({
                error: errorMessage
            });
        }

        return res.status(500).json({
            error: "Error al unirse a la liga"
        });
    }
}

export async function clasificacionLiga(req: Request, res: Response){

    const ligaId = res.locals.ligaId;

    const clasificacion = await sequelize.query(
        `SELECT *
        FROM clasificacion_ligas
        WHERE liga_id = :ligaId
        ORDER BY puntos DESC`,
        {
            replacements: {ligaId},
            type: QueryTypes.SELECT,
        }
    );

    res.status(200).json(clasificacion);
}

export async function participantesLiga(req: Request, res: Response){
    const ligaId = res.locals.ligaId;

    const liga = await Liga.findByPk(ligaId,{
        include:[
            {
                model: Equipo,
                attributes:["nombre"],
                include:[
                    {
                        model: Usuario,
                        attributes:["username"]
                    }
                ]
            }
        ]
    });

    res.status(200).json(liga);
}
