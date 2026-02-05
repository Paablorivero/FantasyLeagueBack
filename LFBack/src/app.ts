import express from "express";
import dotenv from "dotenv";
import routerJugadores from "./routes/jugadores.routes";

import { getPlayersFromApi} from "./footballapi/footballapi.service";

import {testConnectionDB} from "./configs/dbconnection.config"

dotenv.config();

const app = express();

app.use(express.json());

app.use('/daznfntsy', routerJugadores);

const port = process.env.DB_PORT || 3000;

async function startDbConnection(){
    await testConnectionDB();

    app.listen(3000, ()=> console.log(`Server started on port: 3000`));
}

startDbConnection();

getPlayersFromApi();