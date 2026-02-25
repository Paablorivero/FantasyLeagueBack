import {sequelize} from "../configs/dbconnection.config";
import Alineacion from "../models/alineaciones.models";

export async function guardarAlineacion(equipoId: string, jornadaId: number, jugadores: number[]) {

    const t = await sequelize.transaction();

    try {

        // Para no hacer updates de 1 en 1, porque además al cambiar la alineación no quiero hacer update de nada, si no
        // Actualizar todos su miembros, lo que debo de hacer es eliminarlos de la tabla, para luego insertar todo de golpe
        //la nueva alineación.
        await Alineacion.destroy({
            where: { equipoId, jornadaId },
            transaction: t
        });

        // Una vez he borrado la alineación vieja, debo de insertar los datos de la nueva, por lo tanto, de los datos que recibo
        //como parámetros, debo de mapear los jugadores y prepararlos para insertarlos de nuevo.
        const data = jugadores.map(jugadorId => ({
            equipoId,
            jugadorId,
            jornadaId,
            puntuacion: 0
        }));

        // Inserto los nuevos registros en la tabla alineaciones.
        await Alineacion.bulkCreate(data, {
            transaction: t
        });

        await t.commit();

    } catch (e) {
        await t.rollback();
        throw e;
    }
}