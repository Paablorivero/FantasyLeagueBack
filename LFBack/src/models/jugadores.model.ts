import {CreationOptional, DataTypes, Model} from "sequelize";
import {sequelize} from "../configs/dbconnection.config";


class Jugador extends Model{
    declare id: CreationOptional<number>;
    declare jugadorId: number;
    declare nombre: string;
    declare firstName: string;
    declare lastName: string;
    declare edad: number;
    declare nacionalidad: string;
    declare lesionado: boolean;
    declare foto: string;
    declare equipoProfesional: number
};

Jugador.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
            field: 'system_id',
        },

        jugadorId: {
          type: DataTypes.INTEGER,
          unique: true,
          allowNull: false,
          field: 'jugador_id',
        },

        nombre: {
            type: DataTypes.STRING,
            allowNull: false,
            field: 'nombre',
        },

        firstName: {
            type: DataTypes.STRING,
            allowNull: false,
            field: 'first_name',
        },

        lastName: {
            type: DataTypes.STRING,
            allowNull: false,
            field: 'last_name',
        },

        edad: {
            type: DataTypes.STRING,
            allowNull: false,
            field: 'edad',
        },

        nacionalidad: {
            type: DataTypes.STRING,
            allowNull: false,
            field: 'nacionalidad',
        },

        lesionado: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            field: 'lesionado',
        },

        foto: {
            type: DataTypes.STRING,
            allowNull: false,
            field: 'foto',
        },

        equipoProfesional: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: 'equipo_profesional_id',
        }

    },

    {
        sequelize,
        modelName: "Jugador",
        tableName: 'jugadores',
        timestamps: false,
    }
);

export default Jugador;