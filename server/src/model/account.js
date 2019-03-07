/**
 \* Created with IntelliJ IDEA.
 \* User: 彭诗杰
 \* Date: 2018/6/4
 \* Time: 8:52
 \* Description: 持仓账户
 \*/

import {sequelize, Sequelize} from "./sequelize_helper";

const Account = sequelize.define('account', {

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
    balance: Sequelize.FLOAT
});

export default Account;