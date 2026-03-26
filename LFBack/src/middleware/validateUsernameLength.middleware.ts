import {Request, Response, NextFunction} from "express";

export function validateUsernameLength(req: Request, res: Response, next: NextFunction) {
    const username = req.body.username;

    if(username.length < 8){
        res.status(401).send({
            error: "Username debe de tener una longituda mínima de 8 caracteres"
        })
    }

    next();
}