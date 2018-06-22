/**
 \* Created with IntelliJ IDEA.
 \* User: 彭诗杰
 \* Date: 2018/6/4
 \* Time: 22:48
 \* Description: 账本实体
 \*/
import {sequelize, Sequelize} from "./sequelize_helper";

const Ledger = sequelize.define("ledger", {

    hash: {
        type: Sequelize.STRING,
        primaryKey: true
    },
    account_hash: Sequelize.STRING,
    close_time_human: Sequelize.DATE,
    close_time_resolution: Sequelize.INTEGER,
    ledger_index: Sequelize.INTEGER,
    parent_hash: Sequelize.STRING, // 上一区块hash值
    total_coins: Sequelize.STRING,
    transaction_hash: Sequelize.STRING,
    transactions: Sequelize.TEXT
    // 不添加时间戳属性 (updatedAt, createdAt)
    // timestamps: false,
});

export default Ledger;