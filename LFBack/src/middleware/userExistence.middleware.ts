import {Request, Response, NextFunction} from 'express';

import Usuario from "../models/usuario.models";

export const existsUsuario = async (req: Request, res: Response, next: NextFunction) => {
    const usuario = await Usuario.findByPk(res.locals.usuarioId);

    if (!usuario) {
        return res.status(404).json({
            error: 'El usuario buscado no existe'
        });
    }

    res.locals.usuario = usuario;
    next();
}
