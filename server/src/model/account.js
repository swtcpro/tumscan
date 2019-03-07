/**
 \* Created with IntelliJ IDEA.
 \* User: 彭诗杰
 \* Date: 2018/6/4
 \* Time: 8:52
 \* Description: 账户实体，暂时只有钱包地址字段
 \*/

import {sequelize, Sequelize} from "./sequelize_helper";

const Account = sequelize.define('account', {
    address: {
        type: Sequelize.STRING,
        primaryKey: true
    },
});

export default Account;