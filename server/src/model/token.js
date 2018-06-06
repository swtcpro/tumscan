/**
 \* Created with IntelliJ IDEA.
 \* User: 彭诗杰
 \* Date: 2018/6/4
 \* Time: 8:44
 \* Description:    代币实体
 \*/
import {sequelize, Sequelize} from "./sequelize_helper";

const Token = sequelize.define('token', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    currency: Sequelize.STRING,
    issuer: Sequelize.STRING,
    total: Sequelize.FLOAT  // 代币总量
});

export default Token;
