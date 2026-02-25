import  {sequelize}  from "../configs/dbconnection.config";
import Liga from "../models/ligas.models";
import Equipo from "../models/equipos.models";
import {sorteoInicial} from "./sorteoPlantilla.service";
import {crearAlineacionInicial} from "./crearAlineacionInicial.service";

export async function unirseLigaConEquipo(data:{
    nombreEquipo: string;
    usuarioId: string;
    logo: string;
    ligaId: string;
}){

    const transaction = await sequelize.transaction();

    try{
        const equipo = await Equipo.create({
            nombre: data.nombreEquipo,
            logo: data.logo,
            usuarioId: data.usuarioId,
            ligaId: data.ligaId,
        }, {transaction: transaction});

        await sorteoInicial(equipo.ligaId, equipo.equipoId,1, transaction);

        await crearAlineacionInicial(equipo.equipoId, 1, transaction);

        await transaction.commit();

        return {equipo};

    }catch(error){
        await transaction.rollback();
        throw error;
    }
}