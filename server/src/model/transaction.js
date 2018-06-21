/**
 \* Created with IntelliJ IDEA.
 \* User: 彭诗杰
 \* Date: 2018/6/6
 \* Time: 23:36
 \* Description: 交易实体
 \*/
import {sequelize, Sequelize} from "./sequelize_helper";

const Transaction = sequelize.define('transaction', {

    hash: {
        type: Sequelize.STRING,
        primaryKey: true
    },
    Account: Sequelize.STRING,  // 钱包地址
    Amount: Sequelize.STRING,   // 交易金额
    Destination: Sequelize.STRING, // 交易对家地址
    Fee: Sequelize.STRING,  // 交易费
    Flags: Sequelize.INTEGER, // 交易标记
    // Memos: Sequelize.ARRAY, // 备注
    Sequence: Sequelize.INTEGER, // 自身账号的交易号
    SigningPubKey: Sequelize.STRING, // 签名公钥
    Timestamp: Sequelize.INTEGER, // 交易提交时间戳
    TransactionType: Sequelize.STRING, // 交易类型
    TxnSignature: Sequelize.STRING, // 交易签名
    date: Sequelize.INTEGER, // 交易进账本时间
    inLedger: Sequelize.INTEGER, // 交易所在的账本号
    ledger_index: Sequelize.INTEGER, // 账本高度
    // meta: Sequelize.JSON, // 交易影响的节点
    // AffectedNodes: Sequelize.ARRAY, // 受影响的节点
    TransactionIndex: Sequelize.INTEGER,
    TransactionResult: Sequelize.STRING, // 交易结果
    // 不添加时间戳属性 (updatedAt, createdAt)
    // timestamps: false,
});

export default Transaction;