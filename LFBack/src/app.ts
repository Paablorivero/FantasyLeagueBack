import express from "express";
import dotenv from "dotenv";
import routerJugadores from "./routes/jugadores.routes";

import { getPlayersFromApi} from "./footballapi/footballapi.service";

import {testConnectionDB} from "./configs/dbconnection.config"
import routerUsuarios from "./routes/usuarios.routes";
import routerLigas from "./routes/ligas.routes";

import {relationsModels} from "./models/relations.models";
import routerEquipos from "./routes/equipos.routes";
import routerTemporadas from "./routes/temporadas.routes";
import routerJornadas from "./routes/jornadas.routes";
import {errorHandler} from "./middleware/errorHandler.middleware";

import {authMiddleware} from "./middleware/authmiddleware/auth.middleware";

dotenv.config();

const app = express();

relationsModels();

app.use(express.json());

app.use('/daznfntsy',routerUsuarios);

app.use(authMiddleware);


app.use('/daznfntsy', routerJugadores);

app.use('/daznfntsy', routerLigas);

app.use('/daznfntsy', routerEquipos);

app.use('/daznfntsy', routerTemporadas);

app.use('/daznfntsy', routerJornadas);

app.use(errorHandler);

const port = process.env.DB_PORT || 3000;

async function startDbConnection(){
    await testConnectionDB();

    app.listen(3000, ()=> console.log(`Server started on port: 3000`));
}

startDbConnection();

getPlayersFromApi();