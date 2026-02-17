import {Request, Response} from 'express';

import Usuario from "../models/usuario.models";
import {Op} from "sequelize";
import Equipo from "../models/equipos.models";
import Liga from "../models/ligas.models";

export async function registrarNuevoUsuario(req: Request, res: Response) {
    try {
        const { username, email, fechaNacimiento } = req.body;
        console.log("Por aquí en principio deberiamos de ir bien");


        const existe = await Usuario.findOne({
            where: {
                [Op.or]: [{ username }, { email }]
            }
        });

        if (existe) {
            return res.status(400).json({
                error: 'El username o email ya existen'
            });
        }


        const usuarioCreado = await Usuario.create({
            username,
            email,
            fechaNacimiento: fechaNacimiento,
        });

        return res.status(201).json(usuarioCreado);

    } catch (error: any) {
        console.error('ERROR AL CREAR USUARIO:', error);

        return res.status(500).json({
            error: error.original?.message || error.message
        });
    }
}


export async function obtenerTodosLosUsuarios(req: Request, res: Response) {
    try {
        const listadoUsuarios = await Usuario.findAll();

        if (listadoUsuarios.length === 0) {
            return res.status(404).json({
                error: 'No hay ningún usuario dado de alta en el sistema actualmente'
            })
        }

        res.status(200).json(listadoUsuarios);
    } catch (e) {
        console.log(e);
    }
}


export async function obtenerUsuarioPorId(req: Request, res: Response) {
    try {
        const usuarioId = res.locals.usuarioId;

        const usuarioObtenido = await Usuario.findByPk(usuarioId);

        if(!usuarioObtenido) {
            return res.status(404).json({
                error: `No existe un usuario con la ID ${ usuarioId }`
            })
        }

        res.status(200).json(usuarioObtenido);
    } catch (e) {
        console.log(e);
    }
}

export async function obtenerUsuarioPorNombreDeUsuario(req: Request, res: Response) {
    try {
        const username = req.params.username;

        const usuarioObtenido = await Usuario.findOne({where: {username: username}});

        if (!usuarioObtenido) {
            return res.status(404).json({
                error: `No existe un usuario con el nombre de usuario ${ username }`
            })
        }

        res.status(200).json(usuarioObtenido);
    } catch (e) {
        console.log(e);
    }
}

export async function obtenerEquiposDelUsuarioYLigas(req: Request, res: Response) {
    const usuarioSeleccionado = req.params.usuarioId;

    if(!usuarioSeleccionado || typeof usuarioSeleccionado !== 'string'){
        return res.status(400).json({
            error: 'Error al introducir la id a buscar'
        });
    }

    const usuarioYEqupos = Usuario.findByPk(usuarioSeleccionado, {
        attributes: ["username"],
        include: [
            {
                model: Equipo,
                attributes: ['nombre'],
                include: [
                    {
                        model: Liga,
                        attributes: ['nombreLiga'],
                    }
                ]
            }
        ]
        }

    )
}