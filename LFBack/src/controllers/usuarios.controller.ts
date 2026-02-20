import {Request, Response} from 'express';

import Usuario from "../models/usuario.models";
import {Op} from "sequelize";
import Equipo from "../models/equipos.models";
import Liga from "../models/ligas.models";

import bcrypt from "bcrypt";

// Por ahora el registro y el login van aquí. Más adelante posiblemente será más recomendable dejarlo en su propio routes y controller

export async function registrarNuevoUsuario(req: Request, res: Response) {
    try {
        const { username, email, password} = req.body;
        const fechaNacimiento = res.locals.fechaNacimiento;

        const hash = await bcrypt.hash(password, 10);

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
            passwordHash: hash,
            fechaNacimiento,
        });

        return res.status(201).json(`Nuevo usuario creado ${usuarioCreado.username}`);

    } catch (error: any) {
        console.error('ERROR AL CREAR USUARIO:', error);

        return res.status(500).json({
            error: error.original?.message || error.message
        });
    }
}

export async function loginUsuario(req: Request, res: Response) {
    const {username, password} = req.body;

    try{
        const usuario = await Usuario.findOne({
            where: {username}
        });

        if(!usuario) {
            return res.status(401).json({
                error: 'Usuario inexistente'
            });
        }

        const passwordCorrecta = await bcrypt.compare(password, usuario.passwordHash);

        if(!passwordCorrecta) {
            return res.status(401).json({
                error: 'Password Incorrecto'
            });
        }

        return res.status(201).json({
            message: "Login correcto",
            username: usuario.username
        });
    }catch(error){
        return res.status(500).json({
            error: 'Error en el login'
        });
    }
}

// A partir de aquí estas funciones son las que un usuario puede hacer ya cuando esté logeado

export async function obtenerTodosLosUsuarios(req: Request, res: Response) {
    try {
        const listadoUsuarios = await Usuario.findAll();
        return res.status(200).json(listadoUsuarios);
    } catch (e) {
        return res.status(500).json({ error: "Error al obtener usuarios" });
    }
}



export function obtenerUsuarioPorId(req: Request, res: Response) {
    try {
        const usuarioId = res.locals.usuarioId;

        const usuarioObtenido = res.locals.usuario;

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