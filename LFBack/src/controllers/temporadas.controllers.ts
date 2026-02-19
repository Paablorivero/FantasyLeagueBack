import {Request, Response} from "express";
import Temporada from "../models/temporadas.models"

export async function getAllTemporadas(req: Request, res: Response) {
    try {
        const listadoTemporadas = await Temporada.findAll();

        if (listadoTemporadas.length === 0) {
            return res.status(200).json({
                error: 'No se han encontrado registros de temporadas'
            });
        }
        res.status(200).json(listadoTemporadas);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener jornada" });
    }

}

export async function getTemporadaByFecha(req: Request, res: Response) {
    const fecha:string | string[] = req.params.fInicio;

    const listadoTemporadasFecha = await Temporada.findAll({where: {fInicio: fecha}});

    if (!listadoTemporadasFecha) {
        return res.status(200).json({
            error: 'No se ha encontrado una temporada que corresponda a esta fecha'
        });
    }

    res.status(200).json(listadoTemporadasFecha);
}

export async function getTemporadaById(req: Request, res: Response) {
    const id = Number(req.params.temporadaId);

    if(!id || Number.isNaN(id)) {
        res.status(400).json({
            error: 'Mal formato de la temporadaId para realizar la peticion'
        });
    }

    const temporada = await Temporada.findByPk(id);

    if (!temporada) {
        res.status(200).json({
            error: 'No se ha devuelto ningún resultado que coincida con la búsqueda'
        });
    }
    res.status(200).json(temporada);

}

export async function createTemporada(req: Request, res: Response) {

    try {
        const {fInicio, fFin} = req.body;

        if (!fFin || !fInicio || typeof fFin !== 'string' || typeof fInicio !== 'string') {
            return res.status(400).json({
                error: 'Formato de los datos de la petición inocrreta'
            });
        }

        const fechaI = new Date(fInicio);
        const fechaF = new Date(fFin);

        if (fechaF <= fechaI) {
            return res.status(400).json({
                error: 'La fecha de fin no puede ser anterior a la fecha Inicio'
            });
        }

        const nuevaTemporada = await Temporada.create({
            fInicio: fechaI,
            fFin: fechaF
        });

        res.status(200).json(nuevaTemporada);
    } catch (error) {
        res.status(500).json({message: "Error al insertar temporada " + error});
    }

}