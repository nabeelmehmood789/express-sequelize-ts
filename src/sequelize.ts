import {Sequelize} from 'sequelize-typescript';

export const sequelize : Sequelize = new Sequelize("meetings", "root", "root", {
    host: "localhost",
    dialect: "mysql",
    port: 8889,
    models: [__dirname + '/models']
});
