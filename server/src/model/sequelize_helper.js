/**
 \* Created with IntelliJ IDEA.
 \* User: 彭诗杰
 \* Date: 2018/5/28
 \* Time: 10:10
 \* Description: orm框架sequelize帮助文件，用于数据库相关配置信息
 \*/
const Sequelize = require('sequelize');
let env = process.env.NODE_ENV || 'development';
let passwd = '';
let host = '106.14.65.102';
if (env === 'production') {
    passwd = '';
    host = '10.28.65.53'
}
const logger = require('../lib/logger');
logger.info('host: ', host);
logger.info('passwd: ', passwd);


const sequelize = new Sequelize('temp', 'root', passwd, {
    // host: '106.14.65.102',
    host: host,
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
