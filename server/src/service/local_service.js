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
            logger.info(error);
            reject(error);
        })
    })
}

/**
 * 分页查询transaction
 * @param page
 * @param limit
 */
function getTransactionsPaging(page, limit) {
    return new Promise(function (resolve, reject) {
        let offset = (page - 1) * limit;
        entities.Transaction.findAll({offset: offset, limit: limit}).then(function (array) {
            resolve(array);
        }).catch(function (error) {
            logger.info(error);
            reject(error);
        })
    })
}

function getTransactionsCount() {
    return new Promise(function (resolve, reject) {
        entities.Transaction.count().then(function (count) {
            resolve(count)
        }).then(function (error) {
            logger.info(error);
            reject(error)
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
            logger.info(error);
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

function getRankingPaging(page, limit, currency, issuer) {
    return new Promise(function (resolve, reject) {
        let offset = (page - 1) * limit;
        entities.Balance.findAll({
            where: {
                currency: currency,
                issuer: issuer
            },
            offset: offset,
            limit: limit,
            order: [['value', 'DESC']]
        }).then(function (array) {
            if (array) {
                resolve(array);
            } else {
                reject('error, can\'t find the correspond balances')
            }
        }).catch(function (error) {
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
 * @param account
 * @returns {Promise}
 */
function saveAccount(account) {
    return new Promise((resolve, reject) => {
        entities.Account.findById(account.address).then(accountFound => {
            if (accountFound) {
                // logger.info('accountFound', accountFound.dataValues);
                logger.info('find account');
                resolve(accountFound);
            } else {
                logger.info('created account');
                entities.Account.create(account).then(accountCreated => {
                    // logger.info('accountCreated', accountCreated.dataValues);
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
                logger.info('balanceFind: ');
                entities.Balance.update({
                    value: balance.value,
                    freezed: balance.freezed
                }, {
                    where: {
                        address: balance.address,
                        currency: balance.currency,
                        issuer: balance.issuer
                    }
                }).then(function (array) {
                    resolve(balanceFind);
                }).catch(error => {
                    reject(error);
                });
            } else {
                entities.Balance.create(balance).then(balanceCreated => {
                    resolve(balanceCreated);
                })
            }

        }).catch(error => {

            reject(error);
        })
    })
}

function getBalanceCount(att) {
    return new Promise(function (resolve, reject) {
        entities.Balance.count({where: att}).then(function (count) {
            resolve(count)
        }).then(function (error) {
            logger.info(error);
            reject(error)
        })
    })
}

function getAllLegersCount() {
    return new Promise(function (resolve, reject) {
        entities.Ledger.count().then(function (count) {
            resolve(count);
        }).then(function (error) {
            logger.info(error);
            reject(error)
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
        // 将transactions转为字符串
        ledger.transactions = ledger.transactions.join(',');
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
                    transaction_hash: ledger.transaction_hash,
                    transactions: ledger.transactions
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


/**
 * 通过账本高度范围获取账本
 * @param from
 * @param to
 * @returns {Promise}
 */
function getAllLedgers(from, to) {
    const {gt, lte} = entities.Sequelize.Op;
    return new Promise(function (resolve, reject) {
        entities.Ledger.findAll({
            where: {
                ledger_index: {[gt]: from},
                ledger_index: {[lte]: to}
            }
        }).then(function (ledgers) {
            if (ledgers) {
                resolve(ledgers);
            }
        }).catch(function (error) {
            reject(error);
        })
    })
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
            reject(error);
            logger.info(error);
        })
    })
}

/**
 * 通过属性查询得到单一结果token
 * @param att
 * @returns {Promise}
 */
function getToken(att) {
    return new Promise(function (resolve, reject) {
        entities.Token.findOne({
            where:
            att
        }).then(function (token) {
            if (token) {
                resolve(token)
            } else {
                reject('cann\' t find this token')
            }
        }).catch(function (error) {
            reject(error)
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

function setAllTokens0() {
    return new Promise(function (resolve, reject) {
        getAllTokens().then(async tokens => {
            if (tokens) {
                for (let token of tokens) {
                    await updateToken({
                        currency: token.currency,
                        issuer: token.issuer
                    }, {total: 0});
                }
            }
            resolve();
        }).catch(function (error) {
            reject(error);
        })
    })
}

/**
 * 查询所有余额，参数为空全部查询，加入分页参数则分页查询
 * @param limit
 * @param page
 * @returns {Promise}
 */
function getAllBalances(limit, page) {
    return new Promise(function (resolve, reject) {
        if (limit && page) {    // 分页查询
            let offset = (page - 1) * limit;
            entities.Balance.findAll({offset: offset, limit: limit}).then(function (pagedBalances) {
                resolve(pagedBalances);
            }).catch(function (error) {
                logger.info(error);
                reject(error);
            })
        } else {
            entities.Balance.findAll().then(function (allBalances) {
                resolve(allBalances);
            }).catch(function (error) {
                logger.info(error);
                reject(error);
            })
        }
    })
}

function saveTransaction(transaction) {
    return new Promise(function (resolve, reject) {
        entities.Transaction.findOne({
            where: {
                hash: transaction.hash,
            }
        }).then(transactionFind => {
            if (transactionFind) {
                logger.info('transactionFind: ');
                resolve(transactionFind);
            } else {

                // logger.info('transaction: ', transaction);
                entities.Transaction.create(transaction).then(transactionCreated => {
                    resolve(transactionCreated);
                })
            }
        }).catch(error => {
            logger.info(error);
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
    getAllLedgers: getAllLedgers,
    saveAccount: saveAccount,
    getTokensPaging: getTokensPaging,
    getTokensCount: getTokensCount,
    getTokensByIssuerPaging: getTokensByIssuerPaging,
    getTokensCurrencyPaging: getTokensCurrencyPaging,
    getRankingPaging: getRankingPaging,
    getToken: getToken,
    getBalanceCount: getBalanceCount,
    getAllLegersCount: getAllLegersCount,
    setAllTokens0: setAllTokens0,
    getAllBalances: getAllBalances,
    saveTransaction: saveTransaction,
    getTransactionsCount: getTransactionsCount,
    getTransactionsPaging: getTransactionsPaging
}
