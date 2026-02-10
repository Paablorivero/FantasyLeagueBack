import Usuario from "./usuario.models";
import Liga from "./ligas.models";
import Equipo from "./equipos.models";

// En este archivo vamos a tener simplemente las asociaciones que existen entre las diferentes entidades
// Una vez hecho, simplemente debemos importar y llamar a esta función en app.ts

export function relationsModels(){
    Usuario.hasMany(Liga, {foreignKey: "usuarioId"});
    Liga.belongsTo(Usuario, {foreignKey: 'usuarioId'});

    Usuario.hasMany(Equipo, {foreignKey: 'usuarioId'});
    Equipo.belongsTo(Usuario, {foreignKey: 'usuarioId'});

    Liga.hasMany(Equipo, {foreignKey: 'ligaId'});
    Equipo.belongsTo(Liga, {foreignKey: 'ligaId'});
}