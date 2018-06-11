/**
 \* Created with IntelliJ IDEA.
 \* User: 彭诗杰
 \* Date: 2018/6/11
 \* Time: 22:42
 \* Description: 本地数据库区块链统一接口，account,balance,ledger和token
 \*/
import entities from '../model/entities';

const logger = require('../lib/logger');

/**
 * 获取所有的Token
 * @returns {Promise}
 */
function getAllTokens() {
    return new Promise(function (resolve, reject) {
        entities.Token.findAll().then(array => {
            resolve(array);
        }).catch(error => {
            logger.info(error);
            reject(error);
        })
    })
}

/**
 * 根据Id跟新token的属性值
 * @param id
 * @param arr
 * @returns {Promise}
 */
function updateToken(id, arr) {
    return new Promise(function (resolve, reject) {
        entities.Token.update(arr, {
            where: {
                id: id
            }
        }).then(token => {
            resolve(token);
        }).catch(error => {
            reject(error);
        });
    })
}

/**
 * 获取所有的Accounts
 * @returns {Promise}
 */
function getAllAccounts() {
    return new Promise(function (resolve, reject) {
        entities.Account.findAll().then(array => {
            resolve(array);
        }).catch(error => {
            logger.info(error);
            reject(error);
        })
    })
}


export default {
    getAllTokens: getAllTokens,
    updateToken, updateToken,
    getAllAccounts, getAllAccounts
}
