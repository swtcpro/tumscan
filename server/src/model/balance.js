/**
 \* Created with IntelliJ IDEA.
 \* User: 彭诗杰
 \* Date: 2018/6/4
 \* Time: 8:54
 \* Description: 代币余额实体
 \*/

import {sequelize, Sequelize} from "./sequelize_helper";

const Balance = sequelize.define('balance', {
    address: {
        type: Sequelize.STRING,
        primaryKey: true
    },
    currency: {
        type: Sequelize.STRING,
        primaryKey: true
    },
    issuer: {
        type: Sequelize.STRING,
        primaryKey: true
    },
    value: Sequelize.FLOAT,
    freezed: Sequelize.FLOAT
});

export default Balance;