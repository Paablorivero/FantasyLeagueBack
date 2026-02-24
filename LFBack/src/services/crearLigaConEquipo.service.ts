import  {sequelize}  from "../configs/dbconnection.config";
import Liga from "../models/ligas.models";
import Equipo from "../models/equipos.models";
import {sorteoInicial} from "./sorteoPlantilla.service";
import {crearAlineacionInicial} from "./crearAlineacionInicial.service";

// Este servicio está pensado para que la crear una liga, se cree también un equipo. Usa transactions. Pero la versión managed
// de sequelize. Eso, aunque posiblemente no nos hiciese falta para resolver bien el proyecto, se supone que nos protege de
// posibles errores por concurrencia, de la misma forma que el singleton de java. Si hay algún fallo, se hace el rollback cancelando
// las operaciones. La managed de sequelize es la que yo no tengo que llamar manualmente a las funciones de cancelar y hacer el rollbac,

export async function crearLigaConEquipo(data: {
    // Defino variables para almacenar los diferentes datos que deben de llegar.
    nombreLiga: string;
    nombreEquipo: string;
    usuarioId: string;
}) {

    // Defino una constante del tipo transaction.
    const transaction = await sequelize.transaction();

    try {

        // Aquí, creo la liga, con los datos correspondientes
        const liga = await Liga.create({
            nombreLiga: data.nombreLiga,
            usuarioId: data.usuarioId
        }, { transaction: transaction });

        // Aquí creo el equipo con los datos correspondientes
        const equipo = await Equipo.create({
            nombre: data.nombreEquipo,
            usuarioId: data.usuarioId,
            ligaId: liga.ligaId
        }, { transaction: transaction });

        // Aquí el sorteo de equipo inicial
        await sorteoInicial(liga.ligaId, equipo.equipoID, 1, transaction);

        // Una vez creado el servicio creo una alineación inicial
        await crearAlineacionInicial(equipo.equipoID, 1, transaction);

        // Aquí, se espera a que se haga el commit de la transaction.
        await transaction.commit();

        // Devuelvo la nueva liga y el nuevo equipo
        return { liga, equipo };

    //     Aquí la parte importante. Si por alguna razón hay un error. La operación se deshace.
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
}