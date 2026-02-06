import {CreationOptional, Sequelize} from "sequelize";

import{Model, DataTypes} from "sequelize";
import {sequelize} from "../configs/dbconnection.config";

class Usuario extends Model{
    declare usuarioId: CreationOptional<string>;
    declare username: string;
    declare email: string;
    declare fechaNacimiento: Date
}

Usuario.init(
    {
        usuarioId: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            field: 'usuario_id',
        },

        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            field: 'username',
        },

        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            field: 'email',
        },

        fechaNacimiento: {
            type: DataTypes.DATEONLY,
            allowNull: false,
            field: 'f_nacim',
        }
    },

    {
        sequelize,
        modelName: "Usuario",
        tableName: "usuarios",
        timestamps: false,
    }
);

export default Usuario;