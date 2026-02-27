import {Response, Request} from "express";
import { col, literal, ForeignKeyConstraintError, UniqueConstraintError } from "sequelize";
import {sequelize} from "../configs/dbconnection.config";
import {QueryTypes} from "sequelize";

import Equipo from "../models/equipos.models";
import Liga from "../models/ligas.models";
import Jugador from "../models/jugadores.model";
import Plantilla from "../models/plantillas.models";
import { crearLigaConEquipo } from "../services/crearLigaConEquipo.service";
import {unirseLigaConEquipo} from "../services/unirseLigaConEquipo.service";
import Usuario from "../models/usuario.models";

interface MercadoJugadorDto {
    jugadorId: number;
    nombre: string;
    foto: string | null;
    equipoProfesionalNombre: string;
    equipoProfesionalLogo: string | null;
    precio: number;
}


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

export async function mercadoLiga(req: Request, res: Response) {
    const ligaId = res.locals.ligaId;
    const requestedLimit = Number(req.query.limit ?? 20);
    const limit = Number.isFinite(requestedLimit)
        ? Math.min(Math.max(requestedLimit, 1), 50)
        : 20;

    const jugadoresMercado = await sequelize.query<MercadoJugadorDto>(
        `SELECT
            j.jugador_id AS "jugadorId",
            j.nombre AS "nombre",
            j.foto AS "foto",
            COALESCE(ep.nombre, 'Sin equipo') AS "equipoProfesionalNombre",
            ep.logo AS "equipoProfesionalLogo",
            j.valor AS "precio"
         FROM jugadores j
         LEFT JOIN equipos_profesionales ep
            ON ep.equipo_id = j.equipo_profesional_id
         WHERE j.posicion IS NOT NULL
           AND NOT EXISTS (
                SELECT 1
                FROM plantillas p
                WHERE p.jugador_pro = j.jugador_id
                  AND p.liga_id = :ligaId
                  AND p.jornada_fin IS NULL
           )
         ORDER BY RANDOM()
         LIMIT :limit`,
        {
            replacements: { ligaId, limit },
            type: QueryTypes.SELECT,
        }
    );

    return res.status(200).json(jugadoresMercado);
}

export async function comprarJugadorMercado(req: Request, res: Response) {
    const ligaId = res.locals.ligaId;
    const usuarioId = res.locals.jwtUser.sub;
    const jugadorId = Number(req.body?.jugadorId);

    if (!Number.isFinite(jugadorId)) {
        return res.status(400).json({ error: "jugadorId es obligatorio y debe ser numérico" });
    }

    const transaction = await sequelize.transaction();

    try {
        const equiposUsuario = await sequelize.query<{ equipo_id: string; presupuesto: number }>(
            `SELECT equipo_id, presupuesto
             FROM equipos
             WHERE liga_id = :ligaId
               AND usuario_id = :usuarioId
             LIMIT 1
             FOR UPDATE`,
            {
                replacements: { ligaId, usuarioId },
                type: QueryTypes.SELECT,
                transaction,
            }
        );

        const equipoUsuario = equiposUsuario[0];

        if (!equipoUsuario) {
            await transaction.rollback();
            return res.status(403).json({ error: "No tienes equipo en esta liga" });
        }

        const jugador = await Jugador.findByPk(jugadorId, {
            attributes: ["jugadorId", "valor"],
            transaction
        });

        if (!jugador) {
            await transaction.rollback();
            return res.status(404).json({ error: "El jugador no existe" });
        }

        const yaFichado = await Plantilla.findOne({
            where: {
                ligaId,
                jugadorPro: jugadorId,
                jornadaFin: null,
            },
            transaction,
            lock: transaction.LOCK.UPDATE,
        });

        if (yaFichado) {
            await transaction.rollback();
            return res.status(409).json({ error: "El jugador ya no está disponible en el mercado" });
        }

        const jornadas = await sequelize.query<{ jornada_id: number }>(
            `SELECT jornada_id
             FROM jornadas
             ORDER BY jornada_id DESC
             LIMIT 1`,
            {
                type: QueryTypes.SELECT,
                transaction,
            }
        );

        const jornadaActual = jornadas[0]?.jornada_id;
        if (!jornadaActual) {
            await transaction.rollback();
            return res.status(500).json({ error: "No existe una jornada activa para registrar la compra" });
        }

        const precioCompra = jugador.getDataValue("valor") as unknown as number;
        const presupuestoActual = equipoUsuario.presupuesto;

        if (presupuestoActual < precioCompra) {
            await transaction.rollback();
            return res.status(400).json({ error: "No tienes presupuesto suficiente para comprar este jugador" });
        }

        await Plantilla.create({
            ligaId,
            equipoUuid: equipoUsuario.equipo_id,
            jugadorPro: jugadorId,
            jornadaInicio: jornadaActual,
            precioCompra,
            precioVenta: null,
            jornadaFin: null,
        }, { transaction });

        await sequelize.query(
            `UPDATE equipos
             SET presupuesto = presupuesto - :precioCompra
             WHERE equipo_id = :equipoId`,
            {
                replacements: {
                    precioCompra,
                    equipoId: equipoUsuario.equipo_id,
                },
                type: QueryTypes.UPDATE,
                transaction,
            }
        );

        await transaction.commit();

        return res.status(201).json({
            ok: true,
            jugadorId,
            precioCompra,
            presupuestoRestante: presupuestoActual - precioCompra,
        });
    } catch (error) {
        await transaction.rollback();
        if (error instanceof UniqueConstraintError) {
            return res.status(409).json({ error: "El jugador ya no está disponible en el mercado" });
        }
        if (error instanceof ForeignKeyConstraintError) {
            return res.status(400).json({ error: "No se pudo registrar la compra por datos de jornada o equipo" });
        }

        const detail = error instanceof Error ? error.message : "Error desconocido";
        return res.status(500).json({ error: `Error comprando jugador en el mercado: ${detail}` });
    }
}
