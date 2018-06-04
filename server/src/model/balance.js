/**
 \* Created with IntelliJ IDEA.
 \* User: 彭诗杰
 \* Date: 2018/6/4
 \* Time: 8:54
 \* Description: 账户余额实体
 \*/

import {sequelize, Sequelize} from "./sequelize_helper";

const Balance = sequelize.define('balance', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    currency: Sequelize.STRING,
    issuer: Sequelize.STRING,
    value: Sequelize.STRING,
    freezed: Sequelize.STRING
});

export default Balance;