/**
 \* Created with IntelliJ IDEA.
 \* User: 彭诗杰
 \* Date: 2018/5/28
 \* Time: 10:10
 \* Description: orm框架sequelize帮助文件，用于数据库相关配置信息
 \*/
const Sequelize = require('sequelize');
const sequelize = new Sequelize('temp', 'root', 'm7315202', {
    host: 'localhost',
    dialect: 'mysql',
    port: 3306,
    logging: false,
    omitNull: true,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
    },
    // 仅限 SQLite
    storage: 'path/to/database.sqlite',
});

module.exports = {
    sequelize,
    Sequelize,
};

export default sequelize;
