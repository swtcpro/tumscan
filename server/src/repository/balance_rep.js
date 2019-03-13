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

/**
 *
 * @param token
 * @return {Promise}
 */
function findByToken(token) {
    return new Promise((resolve, reject) => {
        entities.Balance.findAll({
            where: {
                issuer: issuer,
                currency: token.currency,
            }
        }).then(balances => {
            resolve(balances)
        }).catch(error => {
            reject(error)
        })
        // entities.Token.findOne({
        //     where: {issuer: issuer, currency: token.currency},include: [{
        //         model: Balance,
        //         as: 'balances'
        //     }]
        // }).then((savedToken) => {
        //     resolve(savedToken)
        // }).catch(function (error) {
        //     reject(error);
        // })
    })
}

export default {
    save: save,
    findByToken: findByToken
}


