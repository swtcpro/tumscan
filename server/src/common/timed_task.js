/**
 \* Created with IntelliJ IDEA.
 \* User: 彭诗杰
 \* Date: 2018/5/28
 \* Time: 16:57
 \* Description: 该文件中定时任务用户同步井通区块链中账本数据
 \*/
import Account from "../model/account";
import jingtumService from '../service/jingtum_service';
import entities from '../model/entities';
import Balance from "../model/balance";
import util from '../common/utils';
import localService from '../service/local_service';

const jutils = require('jingtum-lib').utils;
const remote = require('../lib/remote');
const async = require('async');
const logger = require('../lib/logger');
const resultCode = require('../lib/resultCode');
const ClientError = require('../lib/errors').ClientError;
const NetworkError = require('../lib/errors').NetworkError;

const INIT_LEDGER_INDEX = 266955;

let timeTask = {};

/**
 * 初始化同步：从创世账本开始，同步所有公链账本数据
 */
timeTask.initSync = function () {
    return new Promise(function (resolve, reject) {
        getLatestLedger().then(async latest_index => {
            let savedLedgers = [];
            for (let ledgerIndex = INIT_LEDGER_INDEX + 1; ledgerIndex <= latest_index; ledgerIndex++) {
                let savedLedger = await extractAccountsLedger(ledgerIndex);
                logger.info(ledgerIndex);
                logger.info(latest_index);
                savedLedgers.push(savedLedger);
            }
            analyseLedgerTransactions(savedLedgers).then(() => {
                this.countTokenAndBalances().then(() => {
                    logger.info('time_task: 初始化同步完成!');
                    resolve(savedLedgers);
                })
            }).catch(function (error) {
                reject(error);
            })
        })
    })
};

/**
 * 普通同步，从tumscan数据库中存储最新的账本和公链中最新的账本高度对比，
 * 根据差值，同步差异账本数据
 */
timeTask.sync = function () {
    let index_local = INIT_LEDGER_INDEX;
    entities.Ledger.max('ledger_index').then(ledger_index => {
        index_local = ledger_index;
        // 获取当前公链中最新的账本高度
        getLatestLedger().then(async latest_index => {
            let ledgers = [];
            for (let ledgerIndex = index_local + 1; ledgerIndex <= latest_index; ledgerIndex++) {
                let ledger = await extractAccountsLedger(ledgerIndex);
                logger.info(ledgerIndex);
                logger.info(latest_index);
                ledgers.push(ledger);
            }
            analyseLedgerTransactions(ledgers).then(() => {
                this.countTokenAndBalances().then(() => {
                    logger.info('time_task: 同步完成!');
                })
            })
        })
    })
};

/**
 * 人工手动同步，通过指定账本高度区间进行同步
 * @param from
 * @param to
 * @param from2
 * @param to2
 */
timeTask.manualSync = function (from, to, from2, to2) {
    return new Promise(function (resolve, reject) {
        const extrac = async function (ledgers, from, to) {
            for (let ledgerIndex = from + 1; ledgerIndex <= to; ledgerIndex++) {
                let ledger;
                try {
                    ledger = await extractAccountsLedger(ledgerIndex);
                } catch (e) {
                    logger.info(e)
                }
                ledgers.push(ledger);
            }
            return ledgers;
        };
        extrac([], from, to).then((ledgers) => {
            localService.getAllLedgers(from2, to2).then(function (assignedLedgers) {
                analyseLedgerTransactions(assignedLedgers).then(() => {
                    timeTask.countTokenAndBalances().then(() => {
                        logger.info('time_task: 手动同步完成!');
                        resolve(assignedLedgers);
                    }).catch(function (error) {
                        reject(error);
                    });
                }).catch(function (error) {
                    reject(error);
                });
            }).catch(function (error) {
                reject(error);
            });
        })

    })
};

/**
 * 从本地数据库中指定账本高度进行代币统计
 */
timeTask.localSync = function (from, to) {
    return new Promise(function (resolve, reject) {
        localService.getAllLedgers(from, to).then(function (ledgers) {
            analyseLedgerTransactions(ledgers).then(() => {
                logger.info('完成了analyseLedgerTransactions:');
                timeTask.countTokenAndBalances().then(() => {
                    resolve(ledgers);
                }).catch(function (error) {
                    reject(error);
                });
            }).catch(function (error) {
                reject(error);
            });
        }).catch(function (error) {
            reject(error)
        });
    });
};

/**
 * 从指定账本高度范围一个一个账本逐步同步
 * @param from
 * @param to
 * @returns {Promise}
 */
timeTask.syncOneByOne = function (from, to) {
    return new Promise(async function (resolve, reject) {
        let currentHeight = from;
        for (let index = from + 1; index < to; index++) {
            let transactions;
            try {
                let savedLedger = await extractAccountsLedger(index);
                transactions = await analyseSingleledger(savedLedger);
            } catch (e) {
                logger.error(e);

            }
            if (transactions) {
                for (let transaction of transactions) {
                    try {
                        await extractAccountAndSave(transaction)
                    } catch (e) {
                        logger.error(e)
                    }
                }
            }
            currentHeight = index;
        }
        resolve(currentHeight)
    })
};

/**
 * 实时从公链中下载账本数据，并从账本交易中提取账户和账户余额信息，存入数据库
 * @returns {Promise}
 */
timeTask.getAccountsRealTime = function () {
    return new Promise(function (resolve, reject) {
        getLatestLedger().then(function (ledger_index) {
            extractAccountsLedger(ledger_index).then(function (savedLedger) {
                analyseSingleledger(savedLedger).then(async function (accounts) {
                    let balances = [];
                    await (async function () {
                        for (let account of accounts) {
                            logger.info('account: ', account.dataValues);

                            let balancesAssos = await queryBalanceAndSave(account);
                            balances = balances.concat(balancesAssos);
                        }
                    })();
                    resolve(balances);
                }).catch(function (error) {
                    reject(error);
                })
            }).catch(function (error) {
                reject(error);
            })
        }).catch(function (error) {
            reject(error);
        })
    })
};

/**
 * 统计账户持仓排名，对数据库中账户和账户余额数据进行统计
 * countTokenAndBalances不同的是不更新余额，只是统计代币持仓
 * 可能应用于非实时的代币统计
 */
timeTask.countTokenRanking = function () {
    return new Promise(function (resolve, reject) {
        localService.setAllTokens0().then(function () {
            localService.getAllBalances().then(async function (allBalances) {
                // 获取全部的余额进行代币统计
                logger.info('allBalances length: ', allBalances.length);
                for (let balance of allBalances) {
                    let token = await localService.findOrCreateToken({
                        currency: balance.currency,
                        issuer: balance.issuer
                    });
                    token.total = token.total + util.changeTwoDecimal(balance.value);
                    logger.info('total: ' + token.total, 'balance: ' + balance.value);
                    await localService.updateToken({
                        currency: balance.currency,
                        issuer: balance.issuer
                    }, {total: token.total});
                    // await localService.findOrCreateToken({
                    //     currency: balance.currency,
                    //     issuer: balance.issuer
                    // }).then(async token => {
                    //     token.total = token.total + util.changeTwoDecimal(balance.value);
                    //     logger.info('token: ' + token.currency + 'total: ' + token.total, 'balance: ' + balance.value);
                    //     await localService.updateToken({
                    //         currency: balance.currency,
                    //         issuer: balance.issuer
                    //     }, {total: token.total});
                    // })
                }
                resolve();
            }).catch(function (error) {
                reject(error);
            })
        }).catch(function (error) {
            reject(error);
        })
    })
};

/**
 * 从交易中提取涉及账户并存储
 * @param transaction
 * @return {promise} balances嵌套数组
 */
function extractAccountAndSave(transaction) {
    return new Promise(function (resolve, reject) {
        let accountBoth = extractAccount(transaction);
        Promise.all(queryBalanceAndSave(accountBoth.Account), queryBalanceAndSave(accountBoth.Destination)).then(function (balanceArr) {
            resolve(balanceArr);
        }).catch(function (error) {
            reject(error)
        })
    })
}

/**
 * 根据本地已经下载的账户查询余额
 */
timeTask.generateBalances = function () {
    return new Promise(function (resolve, reject) {
        localService.getAllAccounts().then(async function (accounts) {
            for (let account of accounts) {
                let balancesAssoci;
                try {
                    balancesAssoci = await queryBalanceAndSave(account);
                } catch (e) {
                    logger.info(e);
                }
            }
            resolve();
        })
    })
};

/**
 * 查询指定账户的余额，设置余额账户相互关联，并将其存入数据库
 * @param account
 * @returns {Promise}
 */
function queryBalanceAndSave(account) {
    return new Promise((resolve, reject) => {
        let address = account.address;
        if (!address || !jutils.isValidAddress(address)) {
            return new ClientError(resultCode.C_ADDRESS);
        }
        let condition = {};
        let options = {account: address, type: 'trust'};
        let options2 = {account: address, type: 'freeze'};
        async.parallel({
            native: function (callback) {
                let req1 = remote.requestAccountInfo(options);
                req1.submit(callback);
            },
            lines: function (callback) {
                let req2 = remote.requestAccountRelations(options);
                req2.submit(callback);
            },
            lines2: function (callback) { //关系中设置的冻结
                let req2 = remote.requestAccountRelations(options2);
                req2.submit(callback);
            },
            orders: function (callback) {
                let offers = [];

                function getOffers() {
                    let req3 = remote.requestAccountOffers(options);
                    req3.submit(function (err, result) {
                        if (err) {
                            callback(err)
                        }
                        else if (result.marker) {
                            offers = offers.concat(result.offers);
                            options = {account: address, marker: result.marker};
                            getOffers(options);
                        } else {
                            offers = offers.concat(result.offers);
                            result.offers = offers;
                            callback(null, result);
                        }
                    });
                }

                getOffers(options);
            }
        }, function (err, results) {
            if (err) {
                let error = {};
                if (err.msg) {
                    error = err;
                } else {
                    error.msg = err;
                }
                logger.error('fail to get balance: ' + err);
                reject(err);
            } else {
                let result = jingtumService.process_balance(results, condition);
                // 将各个账户的balances存入到数据库
                if (result && result.balances) {
                    const saveBalances = async function () {
                        let balancesAssociated = [];
                        await(async function () {
                            for (let balance of result.balances) {
                                balance = await localService.saveBalance(balance, account);
                                logger.info('balance: ', balance.dataValues)
                                balancesAssociated.push(balance);
                            }
                        })();
                        return balancesAssociated;
                    };
                    saveBalances().then(function (balancesAssociated) {
                        localService.saveAccountBalances(account, balancesAssociated).then(() => {
                            resolve(balancesAssociated);
                        })
                    });
                }
            }
        });
    });
}

/**
 * 统计账户中的代币和余额信息
 * 其中账户是已存储在本地数据库中的账户
 */
timeTask.countTokenAndBalances = function () {
    /**
     * 第一步将所有的代币total清零
     * 第二步查询公链每个账户中的余额，将余额存入数据库，通过for循环遍历所有账户
     * 第三步查询数据库所有的余额，根据各个账户的余额统计代币总量
     *
     */
    return new Promise((resolve, reject) => {
        localService.getAllTokens().then(tokens => {
            if (tokens) {
                tokens.forEach(async (token, index) => {
                    await localService.updateToken({
                        currency: token.currency,
                        issuer: token.issuer
                    }, {total: 0});
                })
            }
            localService.getAllAccounts().then(async function (accounts) {
                let allBalances = [];
                for (let account of accounts) {
                    try {
                        let balancesAssociated = await queryBalanceAndSave(account);
                        allBalances = allBalances.concat(balancesAssociated)
                    } catch (e) {

                    }
                }
                logger.info('token: ' + token.currency + 'total: ' + token.total, 'balance: ' + balance.value);
                // 获取全部的余额进行代币统计
                for (let balance of allBalances) {
                    let token = await localService.findOrCreateToken({
                        currency: balance.currency,
                        issuer: balance.issuer
                    });
                    token.total = token.total + util.changeTwoDecimal(balance.value);
                    logger.info('total: ' + token.total, 'balance: ' + balance.value);
                    await localService.updateToken({
                        currency: balance.currency,
                        issuer: balance.issuer
                    }, {total: token.total});
                    // await localService.findOrCreateToken({
                    //     currency: balance.currency,
                    //     issuer: balance.issuer
                    // }).then(async token => {
                    //     token.total = token.total + util.changeTwoDecimal(balance.value);
                    //     logger.info('total: ' + token.total, 'balance: ' + balance.value);
                    //     await localService.updateToken({
                    //         currency: balance.currency,
                    //         issuer: balance.issuer
                    //     }, {total: token.total});
                    // })
                }
                resolve();
            }).catch(function (error) {
                reject(error);
            })
        });
    })
};

/**
 * 检索账本其中的交易信息，如果是买入或者卖出的交易则记录交易双方的address
 * @param ledgerIndex 账本高度
 */
function extractAccountsLedger(ledgerIndex) {
    return new Promise((resolve, reject) => {
        if (!remote || !remote.isConnected()) {
            logger.error(resultCode.N_REMOTE.msg);
            return new NetworkError(resultCode.N_REMOTE);
        }
        /**
         * 将下列代码queryLedgerByIndex方法中的内容直接提出，
         */

        let req = remote.requestLedger({
            ledger_index: ledgerIndex + '',
            transactions: true
        });
        req.submit(function (err, ledger) {
            if (err) {
                console.log('err:', err);
                reject(err);
            }
            else if (ledger) {
                /**
                 * 此处虽然讲账本数据存在了本地，但是并没有遍历本地所有的账本来获取交易
                 * 只是将增量账本中的交易取出进行账户地址分析
                 */
                localService.saveLedger(ledger).then(savedLedger => {
                    logger.info('extractAccountsLedger', ledgerIndex);
                    resolve(savedLedger);
                })
            }
        });
    })
}

/**
 * 获取公链最新的账本
 */
function getLatestLedger() {
    return new Promise((resolve, reject) => {
        if (!remote || !remote.isConnected()) {
            logger.error(resultCode.N_REMOTE.msg);
            return new NetworkError(resultCode.N_REMOTE);
        }
        let req = remote.requestLedgerClosed();
        req.submit((err, ledger) => {
            if (err) {
                logger.error(err);
            } else {
                resolve(ledger.ledger_index);
            }
        })
    })
}

/**
 * 分析账本中交易，将其sent和received类型交易中交易双方
 * 的地址分析、抽取出来，写入本地数据库
 * @param ledgers
 */
function analyseLedgerTransactions(ledgers) {
    return new Promise(async (resolve, reject) => {
        let accounts = [];
        for (let ledger of ledgers) {
            ledger.transactions = ledger.transactions.split(',');
            for (let transactionHash of ledger.transactions) {
                if (transactionHash) {
                    let transaction = await jingtumService.queryTx(transactionHash);
                    let affectAccounts = extractAccount(transaction);
                    // 将链上数据库写入本地数据库
                    if (affectAccounts) {
                        await localService.saveAccount({address: affectAccounts.Account});
                        await localService.saveAccount({address: affectAccounts.Destination});
                        accounts.push(affectAccounts.Account);
                        accounts.push(affectAccounts.Destination);
                    }
                }
            }
            // await (async function () {
            //     for (let ledger of ledgers) {
            //         ledger.transactions = ledger.transactions.split(',');
            //         for (let transactionHash of ledger.transactions) {
            //             if (transactionHash) {
            //                 await jingtumService.queryTx(transactionHash).then((async transaction => {
            //                     let affectAccounts = extractAccount(transaction);
            //                     // 将链上数据库写入本地数据库
            //                     if (affectAccounts) {
            //                         // logger.info('affectAccounts', affectAccounts);
            //                         await localService.saveAccount({address: affectAccounts.Account});
            //                         await localService.saveAccount({address: affectAccounts.Destination});
            //                         accounts.push(affectAccounts.Account);
            //                         accounts.push(affectAccounts.Destination);
            //                     }
            //                 })).catch(function (error) {
            //                     reject(error)
            //                 })
            //             }
            //         }
            //     }
            // })();

        }
        resolve(accounts);
    })
}

/**
 * 从单个账本中提取参与交易的账户
 * @param ledger
 * @returns {Promise}
 */
function analyseSingleledger(ledger) {
    return new Promise(async function (resolve, reject) {
        ledger.transactions = ledger.transactions.split(',');
        let accounts = [];
        await (async function () {
            for (let transactionHash of ledger.transactions) {
                if (transactionHash) {
                    await jingtumService.queryTx(transactionHash).then(async function (transaction) {
                        let affectAccounts = extractAccount(transaction);
                        // 将链上数据库写入本地数据库
                        if (affectAccounts) {
                            let account = await localService.saveAccount({address: affectAccounts.Account});
                            let destination = await localService.saveAccount({address: affectAccounts.Destination});
                            accounts.push(account);
                            accounts.push(destination);
                        }
                    }).catch(function (error) {
                        reject(error)
                    })
                }
            }
        })();
        resolve(accounts);
    })
}

/**
 * 从交易中抽取交易类型是Payment和received类型的交易
 * @param transaction
 * @return {'Account': '', 'Destination': ''}
 */
function extractAccount(transaction) {
    if (transaction.TransactionType === 'Payment' || transaction.TransactionType === 'received') {
        return {'Account': transaction.Account, 'Destination': transaction.Destination}
    } else {
        return null;
    }
}

module.exports = timeTask;
