import {Request, Response} from 'express';

import Usuario from "../models/usuario.models";
import {Op} from "sequelize";
import Equipo from "../models/equipos.models";
import Liga from "../models/ligas.models";

import bcrypt from "bcrypt";

import jwt from "jsonwebtoken";

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
                error: 'Credenciales incorrectas'
            });
        }

        const passwordCorrecta = await bcrypt.compare(password, usuario.passwordHash);

        if(!passwordCorrecta) {
            return res.status(401).json({
                error: 'Credenciales incorrectas'
            });
        }

        const token = jwt.sign(
            {
                sub: usuario.usuarioId,
                username: usuario.username,
                rol: usuario.rol,
            },

            process.env.JWT_SECRET!,
            {expiresIn: 3600}
        );

        return res.status(200).json({
            token
        })
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

        const usuarioObtenido = res.locals.jwtUser;

        if(!usuarioObtenido) {
            return res.status(404).json({
                error: `No existe un usuario seleccionado`
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
    const usuario = res.locals.jwtUser;

    const usuarioYEqupos = await Usuario.findByPk(usuario.usuarioId, {
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

    );

    res.status(200).json(usuarioYEqupos);
}

export async function modificarUsuario(req: Request, res: Response) {

    const usuarioId = res.locals.jwtUser.sub;

    const {username, email} = req.body;

    const emailExist = await Usuario.findOne({where: {email: email}});

    if (emailExist) {
        return res.status(400).json({
            error: 'Este email ya pertenece a otro usuario'
        });
    }

    const usuario = await Usuario.findByPk(usuarioId);

    if(!usuario) {
        return res.status(401).json({
            error: 'No existe un usuario'
        });
    }

    await usuario.update({
        username,
        email,
    });

    return res.status(200).json({
        message: 'Datos del usuario actualizados correctamente'
    });
}