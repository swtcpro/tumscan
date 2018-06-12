/**
 \* Created with IntelliJ IDEA.
 \* User: 彭诗杰
 \* Date: 2018/6/11
 \* Time: 22:42
 \* Description: 本地数据库区块链统一接口，account,balance,ledger和token
 \*/
import entities from '../model/entities';
import Account from "../model/account";
import Balance from "../model/balance";

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
 * @param params
 * @param arr
 * @returns {Promise}
 */
function updateToken(params, arr) {
    return new Promise(function (resolve, reject) {
        entities.Token.update(arr, {
            where: params
        }).then(token => {
            resolve(token);
        }).catch(error => {
            logger.info(error);
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

/**
 * 保存账户
 * @param address
 * @returns {Promise}
 */
function saveAccount(account) {
    return new Promise((resolve, reject) => {
        entities.Account.findById(account.address).then(accountFound => {
            if (accountFound) {
                logger.info('accountFound', accountFound.dataValues);
                logger.info('find account')
                resolve(accountFound);
            } else {
                logger.info('created account')
                entities.Account.create(account).then(accountCreated => {
                    logger.info('accountCreated', accountCreated.dataValues);
                    resolve(accountCreated);
                })
            }
        }).catch(error => {
            logger.info(error);
            reject(error);
        })
    })
}

/**
 * 保存余额（首先进行查询，如果该余额不存在，则进行保存）
 * @param balance
 * @param account
 * @returns {Promise}
 */
function saveBalance(balance, account) {
    return new Promise((resolve, reject) => {
        if (balance.issuer === '') {
            balance.issuer = 'SWT'
        }
        balance.address = account.address;
        entities.Balance.findOne({
            where: {
                address: balance.address,
                currency: balance.currency,
                issuer: balance.issuer
            }
        }).then(balanceFind => {
            if (balanceFind) {
                resolve(balanceFind);
            } else {
                entities.Balance.create(balance).then(balanceCreated => {
                    resolve(balanceCreated);
                })
            }

        }).catch(error => {
            logger.info(error);
        })
    })
}

/**
 * 保存账本
 * @param ledger
 * @returns {Promise}
 */
function saveLedger(ledger) {
    return new Promise((resolve, reject) => {
        entities.Ledger.findOne({
            where: {
                hash: ledger.ledger_hash
            }
        }).then(ledgerFound => {
            if (ledgerFound) {
                logger.info('find ledger');
                resolve(ledgerFound)
            } else {
                entities.Ledger.create({
                    hash: ledger.ledger_hash,
                    account_hash: ledger.account_hash,
                    close_time_human: ledger.close_time_human,
                    close_time_resolution: ledger.close_time_resolution,
                    ledger_index: ledger.ledger_index,
                    parent_hash: ledger.parent_hash,
                    total_coins: ledger.total_coins,
                    transaction_hash: ledger.transaction_hash
                }).then(ledgerCreated => {
                    resolve(ledgerCreated)
                })
            }
        }).catch(error => {
            logger.info(error);
            reject(error);
        })
    });
}

function findOrCreateToken(att) {
    return new Promise((resolve, reject) => {
        entities.Token.findOne({
            where: att
        }).then(token => {
            if (token) {
                // logger.info('find token');
                resolve(token)
            } else {
                // logger.info('create token');
                entities.Token.create(att).then(token => {
                    resolve(token);
                })
            }
        }).catch(error => {
            logger.info(error);
        })
    })
}

function saveAccountBalances(account, balances) {
    return new Promise((resolve, reject) => {
        Account.hasMany(Balance);
        Balance.belongsTo(Account);
        account.setBalances(balances).then(() => {
            resolve();
        }).catch(error => {
            reject(error);
        })
    })
}

export default {
    getAllTokens: getAllTokens,
    updateToken: updateToken,
    getAllAccounts: getAllAccounts,
    saveBalance: saveBalance,
    saveAccountBalances: saveAccountBalances,
    findOrCreateToken: findOrCreateToken,
    saveLedger: saveLedger,
    saveAccount, saveAccount
}
