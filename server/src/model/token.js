/**
 \* Created with IntelliJ IDEA.
 \* User: 彭诗杰
 \* Date: 2018/6/4
 \* Time: 8:44
 \* Description:    代币实体
 \*/
import {sequelize, Sequelize} from "./sequelize_helper";

const Token = sequelize.define('token', {
    currency: {
        type: Sequelize.STRING,
        primaryKey: true
    },
    issuer: {
        type: Sequelize.STRING,
        primaryKey: true
    },
    total: Sequelize.FLOAT,  // 代币总量
    value: Sequelize.FLOAT   // 代币价格
});

export default Token;
