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
import Ledger from './ledger'

import {sequelize,} from './sequelize_helper';

// 设置级联关系
messageTopic.hasMany(messageBoard, {
    as: 'messageitem',
});

Account.hasMany(Balance, {
    as: 'balance'
});

sequelize.sync();

const entities = {
    messageBoard,
    messageTopic,
    Account,
    Balance,
    Token,
    Ledger,
    sequelize
};
export default entities;
