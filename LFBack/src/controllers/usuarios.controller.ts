import {Request, Response} from 'express';

import Usuario from "../models/usuario.models";
import {Op} from "sequelize";
import Equipo from "../models/equipos.models";
import Liga from "../models/ligas.models";
import {LoginResponseDto} from "../DTOs/loginResponse.dto";
import {UserInfoResponseDto} from "../DTOs/userInfoResponse.dto";

import bcrypt from "bcrypt";

import jwt from "jsonwebtoken";
import {loginService} from "../services/login.service";

// Por ahora el registro y el login van aquí. Más adelante posiblemente será más recomendable dejarlo en su propio routes y controller

export async function registrarNuevoUsuario(req: Request, res: Response) {
    try {
        const { username, email, password} = req.body;
        const fechaNacimiento: string = res.locals.fechaNacimiento;

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
        const loginData = await loginService(username, password);
        const userResponse: LoginResponseDto = {
            token : loginData.token,
            user : {
                uuid: loginData.user.uuid,
                username : loginData.user.username,
                rol: loginData.user.rol,
            }
        }
        return res.status(200).json(userResponse);
    }catch(error){
        return res.status(401).json({
            error: 'Error en el login'
        });
    }
}

// A partir de aquí estas funciones son las que un usuario puede hacer ya cuando esté logeado

export async function obtenerTodosLosUsuarios(req: Request, res: Response) {
    try {
        const listadoUsuarios = await Usuario.findAll({
            attributes: ["usuarioId", "username", "email", "rol", "fechaNacimiento"]

        });

        const userListResponse: UserInfoResponseDto[] = listadoUsuarios.map(usuario => limpiarDatosDeRespuesta(usuario));

        console.log(userListResponse);
        return res.status(200).json(userListResponse);

    } catch (e) {
        return res.status(500).json({ error: "Error al obtener usuarios" });
    }
}



export function obtenerUsuarioPorId(req: Request, res: Response) {
    try {

        const usuarioObtenido = res.locals.usuario;

        if(!usuarioObtenido) {
            return res.status(404).json({
                error: `No existe un usuario seleccionado`
            })
        }

        const usuario: UserInfoResponseDto = limpiarDatosDeRespuesta(usuarioObtenido);

        res.status(200).json(usuario);
    } catch (e) {
        res.status(500).json({ error: "Error al obtener usuarios" });
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

        const usuarioLimpio: UserInfoResponseDto = limpiarDatosDeRespuesta(usuarioObtenido);

        res.status(200).json(usuarioLimpio);
    } catch (e) {
        console.log(e);
    }
}

export async function obtenerEquiposDelUsuarioYLigas(req: Request, res: Response) {
    const usuario = res.locals.jwtUser;

    const usuarioYEqupos = await Usuario.findByPk(usuario.sub, {
        attributes: ["username"],
        include: [
            {
                model: Equipo,
                attributes: ['equipoId', 'nombre', 'ligaId'],
                include: [
                    {
                        model: Liga,
                        attributes: ['ligaId', 'nombreLiga'],
                    }
                ]
            }
        ]
        }

    );

    if(!usuarioYEqupos){
        return res.status(404).json({
            error:"No existen datos para el usuario buscado"
        });
    }

    const cleanData = usuarioYEqupos.get({plain : true});

    res.status(200).json(cleanData);
}

export async function modificarUsuario(req: Request, res: Response) {

    const usuarioId: string = res.locals.jwtUser.sub;

    const {username, email, fechaNacimiento} = req.body;

    const emailExist: Usuario | null = await Usuario.findOne({where: {email: email}});

    if (emailExist && emailExist.usuarioId !== usuarioId) {
        return res.status(400).json({
            error: 'Este email ya pertenece a otro usuario'
        });
    }

    const usuario: Usuario | null = await Usuario.findByPk(usuarioId);

    if(!usuario) {
        return res.status(401).json({
            error: 'No existe un usuario'
        });
    }

    const userDataToUpdate: Record<string, string> = {
        username,
        email,
    };

    if (fechaNacimiento) {
        userDataToUpdate.fechaNacimiento = fechaNacimiento;
    }

    await usuario.update(userDataToUpdate);

    const userCleanData: UserInfoResponseDto = limpiarDatosDeRespuesta(usuario);

    return res.status(200).json(userCleanData);
}

/**
 *
 * @param usuario
 * El parámetro usuario son los datos que devuelve sequelize al hacer una consulta, por lo que viene con metadatos propios de las realaciones y de la
 * base de datos que no queremos.
 * El método retorna los datos limpios para devolverlo, sin elementos adicionales. Con la fecha trabajada para devolverla en el formato que
 * nos es más cómodo.
 */
function limpiarDatosDeRespuesta(usuario: any){
    const usuarioLimpio: UserInfoResponseDto = {
        email: usuario.email,
        fechaNacimiento: usuario.fechaNacimiento ? new Date(usuario.fechaNacimiento).toISOString() : null,
        rol: usuario.rol,
        username: usuario.username,
        usuarioId: usuario.usuarioId,
    }

    return usuarioLimpio;
}