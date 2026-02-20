import {Request, Response} from "express";
import Equipo from "../models/equipos.models";
import Usuario from "../models/usuario.models";
import Liga from "../models/ligas.models";


export async function registrarNuevoEquipoEnUnaLiga(req: Request, res: Response) {
    const ligaSeleccionada = res.locals.ligaId;
    const usuarioPropietario = res.locals.usuarioId;

    if(!ligaSeleccionada || typeof ligaSeleccionada !== "string") {
        return res.status(400).send({
            error: "Formato del código de liga no válido"
        });

    }

    if(!usuarioPropietario || typeof usuarioPropietario !== "string") {
        return res.status(400).send({
            error: "Formato del código de usuario no válido"
        });

    }

    const nuevoEquipo = await Equipo.create({
        nombre: req.body.nombre,
        logo: '',
        usuarioId: usuarioPropietario,
        ligaId: ligaSeleccionada
    });

    res.status(201).send(nuevoEquipo);
}

export async function getAllEquiposLiga(req: Request, res: Response) {
    const ligaSeleccionada = req.params.ligaId;

    if(!ligaSeleccionada || typeof ligaSeleccionada !== "string") {
        return res.status(400).send({
            error: 'Formato del código de liga no es válido'
        });

    }

    const listadoEquiposLiga = await Equipo.findAll({where: {ligaId: ligaSeleccionada}});

    res.status(200).send(listadoEquiposLiga);
}

export async function getAllEquiposByUsuario(req: Request, res: Response) {
    const usuarioSeleccionado = req.params.usuarioId;

    if (!usuarioSeleccionado || typeof usuarioSeleccionado !== "string") {
        return res.status(400).json({ error: 'Debe proporcionarse un código de usuario válido' });
    }

    try {
        const listadoEquiposPorUsuario = await Equipo.findAll({
            where: { usuarioId: usuarioSeleccionado },
            include: [
                { model: Usuario, attributes: ['username'] },
                { model: Liga, attributes: ['nombreLiga'] }
            ]
        });

        res.status(200).json(listadoEquiposPorUsuario);
    } catch (error) {
        console.error('Error Sequelize:', error);
        res.status(500).json({ error: 'Error al obtener los equipos' });
    }
}
