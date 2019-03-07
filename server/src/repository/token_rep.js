/**
 \* Created with Webstorm.
 \* @author: 彭诗杰
 \* @time: 2019/3/7 20:05
 \* Description:
 \*/
import entities from '../model/entities';
import Token from '../model/token'

const Sequelize = require('sequelize');
const logger = require('../lib/logger');
const config = require('../lib/config');
const issuer = config.get('issuer');

/**
 * 保存或更新代币
 * @param token {issuer: 'issuer', currency: 'currency', total: 'total'}
 */
function save(token) {
    return new Promise((resolve, reject) => {
        entities.Token.findOrCreate({
            where: {issuer: issuer, currency: token.currency},
            defaults: {total: 0.0, value: 0.0}
        }).spread(function (savedToken, created) {
            if (created) {
                resolve(savedToken);
            } else {
                resolve(savedToken);
            }
        }).catch(function (error) {
            reject(error);
        })
    })
}

/**
 * 获取所有的Token
 * @returns {Promise}
 */
function getAllTokens() {
    return new Promise(function (resolve, reject) {
        entities.Token.findAll().then(array => {
            resolve(array);
        }).catch(error => {
            logger.error(error);
            reject(error);
        })
    })
}

/**
 * 分页查询token
 * @param page
 * @param limit
 */
function getTokensPaging(page, limit) {
    return new Promise(function (resolve, reject) {
        let offset = (page - 1) * limit;
        entities.Token.findAll({offset: offset, limit: limit}).then(function (array) {
            resolve(array);
        }).catch(function (error) {
            logger.error(error);
            reject(error);
        })
    })
}

/**
 * 获取代币种类数量
 * @returns {Promise}
 */
function getTokensCount() {
    return new Promise(function (resolve, reject) {
        entities.Token.count().then(function (count) {
            resolve(count)
        }).then(function (error) {
            logger.error(error);
            reject(error)
        })
    })
}

/**
 * 通过issuer分页查询token
 * @param page
 * @param limit
 * @param issuer
 * @returns {Promise}
 */
function getTokensByIssuerPaging(page, limit, issuer) {
    return new Promise(function (resolve, reject) {
        let offset = (page - 1) * limit;
        entities.Token.findAll({
                where: {issuer: issuer},
                offset: offset,
                limit: limit
            }
        ).then(function (array) {
            resolve(array)
        }).catch(function (error) {
            reject(error)
        })
    })
}

/**
 * 通过currency分页查询token
 * @param page
 * @param limit
 * @param currency
 * @returns {Promise}
 */
function getTokensCurrencyPaging(page, limit, currency) {
    return new Promise(function (resolve, reject) {
        let offset = (page - 1) * limit;
        entities.Token.findAll({
                where: {currency: currency},
                offset: offset,
                limit: limit
            },
        ).then(function (array) {
            resolve(array)
        }).catch(function (error) {
            reject(error)
        })
    })
}

export default {
    save: save,
}