import {Request, Response, NextFunction} from "express";

import Liga from "../models/ligas.models";

export const ligaExists = async (req: Request, res: Response, next: NextFunction) => {
    const liga = await Liga.findByPk(res.locals.ligaId);

    if(!liga){
        return res.status(404).json({
            error: "No hay liga existe"
        });

    }

    res.locals.liga = liga;

    next();
}