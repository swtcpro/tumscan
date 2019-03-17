/**
 \* Created with IntelliJ IDEA.
 \* User: 彭诗杰
 \* Date: 2018/5/28
 \* Time: 10:10
 \* Description: orm框架sequelize帮助文件，用于数据库相关配置信息
 \*/
const Sequelize = require('sequelize');
let env = process.env.NODE_ENV || 'development';
let passwd = 'Hptpd511!@#';
let host = '47.94.244.29';
if (env === 'production') {
    passwd = 'Hptpd511!@#';
    host = '47.94.244.29'
}

const sequelize = new Sequelize('temp', 'root', passwd, {
    // host: '106.14.65.102',
    host: host,
    dialect: 'mysql',
    port: 3306,
    logging: false,
    omitNull: true,
    pool: {
        max: 100,
        min: 0,
        idle: 200000,
        acquire: 1000000,
    },
    // 仅限 SQLite
    storage: 'path/to/database.sqlite',
});

module.exports = {
    sequelize,
    Sequelize,
};

export default sequelize;
