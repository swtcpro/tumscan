/**
 \* Created with IntelliJ IDEA.
 \* User: 彭诗杰
 \* Date: 2018/5/28
 \* Time: 16:57
 \* Description: 该文件中定时任务用户同步井通区块链中账本数据
 \*/
import Account from "../model/account";
import jingtumService from '../service/jingtum_service'
import entities from '../model/entities'
import Balance from "../model/balance";
import util from '../common/utils'
import localService from '../service/local_service'

const jutils = require('jingtum-lib').utils;
const remote = require('../lib/remote');
const async = require('async');
const logger = require('../lib/logger');
const resultCode = require('../lib/resultCode');
const ClientError = require('../lib/errors').ClientError;
const NetworkError = require('../lib/errors').NetworkError;

const INIT_LEDGER_INDEX = 266955;

let timeTask = {}

/**
 * 初始化同步：从创世账本开始，同步所有公链账本数据
 */
timeTask.initSync = function () {
    getLatestLedger().then(latest_index => {
        this.traverseLedgers(INIT_LEDGER_INDEX, latest_index).then(ledgers => {
            this.countTokenAndBalances().then(() => {
                logger.info('time_task: 初始化同步完成!');
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
            logger.info('goes to 1 :', latest_index);

            // let ledgers = await traverseLedgers(index_local + 1, latest_index).then(ledgers => {
            //     analyseLedgerTransactions(ledgers).then(() => {
            //         this.countTokenAndBalances();
            //     })
            // })
        })
    })
};

function queryBalanceAndSave(account) {
    return new Promise((resolve, reject) => {
        if (!account.address || !jutils.isValidAddress(account.address)) {
            return new ClientError(resultCode.C_ADDRESS);
        }
        let condition = {};
        let options = {account: account.address, type: 'trust'};
        let options2 = {account: account.address, type: 'freeze'};
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
            } else {
                let result = jingtumService.process_balance(results, condition);
                // 将各个账户的balances存入到数据库
                if (result && result.balances) {
                    let balancesAssociated = [];
                    (async function () {
                        for (let balance of result.balances) {
                            balance = await localService.saveBalance(balance, account);
                            balancesAssociated.push(balance);
                        }
                        localService.saveAccountBalances(account, balancesAssociated).then(() => {
                            resolve(balancesAssociated);
                        })
                    })();
                }
            }
        });
    })
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
    localService.getAllTokens().then(tokens => {
        if (tokens) {
            tokens.forEach((token, index) => {
                localService.updateToken(token.id, {total: 0});
            })
        }
        localService.getAllAccounts().then(async function (accounts) {
            let allBalances = [];
            for (let account of accounts) {
                let balancesAssociated = await queryBalanceAndSave(account);
                allBalances = allBalances.concat(balancesAssociated)
            }
            // 获取全部的余额进行代币统计
            for (let balance of allBalances) {
                localService.findOrCreateToken({
                    currency: balance.currency,
                    issuer: balance.issuer
                }).then(token => {
                    token.total += balance.value;
                    localService.updateToken(token.id, {total: token.total}).then(token => {

                    })
                })
            }
        })
    });
};

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
 * 遍历指定的账本，检索其中的交易信息，如果是买入或者卖出的交易则记录交易双方的address
 * 也就是统计全网中所有的账户
 * @param from 开始的账本高度
 * @param to 结束的账本高度
 */
function traverseLedgers(from, to) {
    return new Promise((resolve, reject) => {
        if (!remote || !remote.isConnected()) {
            logger.error(resultCode.N_REMOTE.msg);
            return new NetworkError(resultCode.N_REMOTE);
        }
        let ledgers = [];
        /**
         * 将下列代码queryLedgerByIndex方法中的内容直接提出，
         */
        (async function () {
            return new Promise(await function (resolve, reject) {
                for (let ledgerIndex = from; ledgerIndex <= to; ledgerIndex++) {
                    let req = remote.requestLedger({
                        ledger_index: ledgerIndex + '',
                        transactions: true
                    });
                    req.submit(function (err, ledger) {
                        if (err) {
                            console.log('err:', err);
                        }
                        else if (ledger) {
                            entities.Ledger.create({
                                hash: ledger.ledger_hash,
                                account_hash: ledger.account_hash,
                                close_time_human: ledger.close_time_human,
                                close_time_resolution: ledger.close_time_resolution,
                                ledger_index: ledger.ledger_index,
                                parent_hash: ledger.parent_hash,
                                total_coins: ledger.total_coins,
                                transaction_hash: ledger.transaction_hash
                            })
                        }
                    });
                }
                resolve();
            })
        })();
        resolve();

        // for (let ledgerIndex = from; ledgerIndex <= to; ledgerIndex++) {
        //     let req = remote.requestLedger({
        //         ledger_index: ledgerIndex + '',
        //         transactions: true
        //     });
        //     req.submit(function (err, ledger) {
        //         if (err) {
        //             console.log('err:', err);
        //         }
        //         else if (ledger) {
        //             entities.Ledger.create({
        //                 hash: ledger.ledger_hash,
        //                 account_hash: ledger.account_hash,
        //                 close_time_human: ledger.close_time_human,
        //                 close_time_resolution: ledger.close_time_resolution,
        //                 ledger_index: ledger.ledger_index,
        //                 parent_hash: ledger.parent_hash,
        //                 total_coins: ledger.total_coins,
        //                 transaction_hash: ledger.transaction_hash
        //             }).then((savedLedger) => {
        //                 ledgers.push(ledger);
        //                 if (ledgers.length === (to - from)) {
        //                     resolve(ledgers);
        //                 }
        //             })
        //         }
        //     });
        // }
    })
}

/**
 * 将账本存在tumscan数据库
 * @param ledger
 */
function saveLedger(ledger) {
    new Promise((resolve, reject) => {
        entities.Ledger.create({
            hash: ledger.ledger_hash,
            account_hash: ledger.account_hash,
            close_time_human: ledger.close_time_human,
            close_time_resolution: ledger.close_time_resolution,
            ledger_index: ledger.ledger_index,
            parent_hash: ledger.parent_hash,
            total_coins: ledger.total_coins,
            transaction_hash: ledger.transaction_hash
        })
        resolve();
    })
}

/**
 * 分析账本中交易，将其sent和received类型交易中交易双方
 * 的地址分析、抽取出来，写入本地数据库
 * @param ledgers
 */
function analyseLedgerTransactions(ledgers) {
    return new Promise((resolve, reject) => {
        ledgers.forEach(ledger => {
            ledger.transactions.forEach((transactionHash, index) => {
                jingtumService.queryTx(transactionHash).then((transaction => {
                    let affectAccounts = extractAccount(transaction);
                    // 将链上数据库写入本地数据库，使用findOrCreate只是为了主键重复异常
                    entities.Account.findOrCreate({where: {address: affectAccounts.Account}})
                        .spread((account, created) => {

                        })
                    entities.Account.findOrCreate({where: {address: affectAccounts.Destination}})
                        .spread((account, created) => {

                        })
                    if (index === transactions.length) {
                        resolve();
                    }
                }))
            })
        })
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

