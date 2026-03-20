import express from "express";
import dotenv from "dotenv";
import routerJugadores from "./routes/jugadores.routes";

import { getPlayersFromApi} from "./footballapi/footballapi.service";

import {testConnectionDB} from "./configs/dbconnection.config"

import swaggerUi from "swagger-ui-express";
import {swaggerSpec} from "./configs/swaggerjsdoc.config";

import routerUsuarios from "./routes/usuarios.routes";
import routerLigas from "./routes/ligas.routes";
import routerEquipos from "./routes/equipos.routes";
import routerTemporadas from "./routes/temporadas.routes";
import routerJornadas from "./routes/jornadas.routes";
import routerAlineaciones from "./routes/alineaciones.routes";
import routerAuth from "./routes/auth.routes";
import routerPlantillas from "./routes/plantillas.routes";

import {relationsModels} from "./models/relations.models";
import {errorHandler} from "./middleware/errorHandler.middleware";

import {authMiddleware} from "./middleware/authmiddleware/auth.middleware";

import cors from "cors";


dotenv.config();

const app = express();

relationsModels();

app.use(cors({
    origin: 'http://localhost:4200',
    credentials: true
}));


app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/daznfntsy", routerAuth);

app.use('/daznfntsy', authMiddleware, routerUsuarios);

app.use('/daznfntsy', authMiddleware, routerLigas);

app.use('/daznfntsy', authMiddleware, routerAlineaciones);

app.use('/daznfntsy', authMiddleware, routerPlantillas);

app.use('/daznfntsy', authMiddleware, routerJugadores);

app.use('/daznfntsy', authMiddleware, routerEquipos);

app.use('/daznfntsy', authMiddleware, routerTemporadas);

app.use('/daznfntsy', authMiddleware, routerJornadas);

app.use(errorHandler);

const port = Number(process.env.PORT) || 3000;

async function startDbConnection(){
    await testConnectionDB();

    app.listen(port, ()=> console.log(`Server started on port: ${port}`));
}

startDbConnection();

getPlayersFromApi();