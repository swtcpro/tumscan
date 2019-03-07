/**
 \* Created with IntelliJ IDEA.
 \* User: 彭诗杰
 \* Date: 2018/5/28
 \* Time: 11:05
 \* Description: 数据库实体文件，定义为存放数据库中所有的实体表
 \*/

import messageBoard from './messageBoard';
import messageTopic from './messageTopic';
import Account from './account';
import Balance from './balance';
import Token from './token';
import Ledger from './ledger';
import Transaction from './transaction';
import {sequelize, Sequelize} from './sequelize_helper';


// 设置级联关系
messageTopic.hasMany(messageBoard, {
    as: 'messageitem',
});

/**
 * 设置代币和账号一对多关系
 */
Token.hasMany(Account, {
    as: 'accounts'
});

Account.hasMany(Balance, {
    as: 'balance'
});

// Ledger.hasMany(Transaction, {
//     as: 'transaction'
// });

sequelize.sync();

const entities = {
    messageBoard,
    messageTopic,
    Account,
    Balance,
    Token,
    Ledger,
    Transaction,
    sequelize,
    Sequelize
};
export default entities;
