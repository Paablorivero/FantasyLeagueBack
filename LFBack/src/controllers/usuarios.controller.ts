import {Request, Response} from 'express';

import Usuario from "../models/usuario.models";
import {Op} from "sequelize";

export async function registrarNuevoUsuario(req: Request, res: Response) {
    try {
        const { username, email, fechaNacimiento } = req.body;

        if (!username || !email || !fechaNacimiento) {
            return res.status(400).json({
                error: 'Todos los campos son obligatorios'
            });
        }

        if(typeof username !== 'string') {
            return res.status(400).json({
                error: 'El formato del nombre de usuario es invalido'
            });
        }

        if(typeof email !== 'string') {
            return res.status(400).json({
                error: 'El formato del email es invalido'
            })
        }

        const fecha = new Date(fechaNacimiento);

        if (isNaN(fecha.getTime())) {
            return res.status(400).json({
                error: 'Fecha de nacimiento inválida'
            });
        }

        if (fecha > new Date()) {
            return res.status(400).json({
                error: 'La fecha de nacimiento no puede ser posterior a la actual'
            });
        }

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
            fechaNacimiento: fecha
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
    const listadoUsuarios = await Usuario.findAll();

    if(listadoUsuarios.length === 0){
        return res.status(404).json({
            error: 'No hay ningún usuario dado de alta en el sistema actualmente'
        })
    }

    res.status(200).json(listadoUsuarios);
}


export async function obtenerUsuarioPorId(req: Request, res: Response) {
    const usuarioId = req.params.usuarioId;

    if(!usuarioId || typeof usuarioId !== 'string'){
        return res.status(400).json({
            error: 'Error al introducir la id a buscar'
        });
    }

    const usuarioObtenido = await Usuario.findByPk(usuarioId);

    res.status(200).json(usuarioObtenido);
}

export async function obtenerUsuarioPorNombreDeUsuario(req: Request, res: Response) {
    const username = req.params.username;

    if(!username || typeof username !== 'string'){
        return res.status(400).json({
            error: 'Error al introducir la id a buscar'
        });
    }

    const usuarioObtenido = await Usuario.findOne({where: {username: username}});

    res.status(200).json(usuarioObtenido);
}