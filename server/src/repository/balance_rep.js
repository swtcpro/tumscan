/**
 \* Created with WEBSTORM.
 \* User: 彭诗杰
 \* Date: 2019/3/8
 \* Time: 0:35
 \* Description: 代币余额实体 （一种代币对应多个账户余额实体）
 \*/

import entities from '../model/entities';
import Token from '../model/token'
import Balance from "../model/balance";

const Sequelize = require('sequelize');
const logger = require('../lib/logger');
const config = require('../lib/config');
const issuer = config.get('issuer');


function save(token, balance) {
    return new Promise((resolve, reject) => {
        if (token) {
            entities.Balance.findOrCreate({
                where: {
                    address: balance.address,
                    currency: balance.currency,
                    value: balance.value,
                    issuer: issuer
                }, defaults: {
                    value: 0.0,
                    freezed: 0.0
                }
            }).spread(function (savedBalance, created) {
                if (created) {
                    // 设置Balance Token 一对多关系
                    Token.hasMany(Balance);
                    Balance.belongsTo(Token);
                    token.addBalance(savedBalance).then(() => {
                        logger.info('created balance对象!');
                        resolve(savedBalance);
                    });
                } else {
                    logger.info('find balance对象!');
                    resolve(savedBalance);
                }
            }).catch(function (error) {
                reject(error)
            })
        } else {
            reject('token 对象不能为空!')
        }
    })
}

export default {
    save: save
}


