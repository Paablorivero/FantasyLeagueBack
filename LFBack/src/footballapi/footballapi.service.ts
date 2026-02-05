import Jugador from "../models/jugadores.model";

export async function getPlayersFromApi(){
    const temporada: number = 2024;
    const liga: number = 140;
    const totalPaginas: number = 3;

        for (let i = 1; i <= totalPaginas; i++) {
            let listadoJugadores = await fetch(`https://v3.football.api-sports.io/players?season=${temporada}&league=${liga}&page=${i}`, {
                method: "GET",
                headers: {
                    'x-apisports-key': process.env.API_TOKEN as string
                }
            });

            if (!listadoJugadores.ok) {
                throw new Error(`No se encontro el jugadores. Error ${listadoJugadores.status}`);
            }

            let data = await listadoJugadores.json();

            await createOrUpdatePlayers(data.response);

        }

}

async function createOrUpdatePlayers(players: any[]){

    let jugadoresMapeados = players.map(p => ({
        jugadorId: p.player.id,
        nombre: p.player.name,
        firstName: p.player.firstname,
        lastName: p.player.lastname,
        edad: p.player.age,
        nacionalidad: p.player.nationality,
        lesionado: p.player.injured,
        foto: p.player.photo,
        equipoProfesional: p.statistics[0]?.team?.id ?? null
    }));

    await Jugador.bulkCreate(jugadoresMapeados, {
        updateOnDuplicate: ['edad', 'lesionado', 'foto', 'equipoProfesional'],
    });

}