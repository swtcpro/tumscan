/**
 \* Created with IntelliJ IDEA.
 \* User: 彭诗杰
 \* Date: 2018/5/16
 \* Time: 22:42
 \* Description:
 \*/
import localService from "./local_service";
import util from "../common/utils";

const jlib = require('jingtum-lib');
const Remote = jlib.Remote;
const remote = require('../lib/remote');
const async = require('async');
const logger = require('../lib/logger');
const config = require('../lib/config');
const ClientError = require('../lib/errors').ClientError;
const NetworkError = require('../lib/errors').NetworkError;
const resultCode = require('../lib/resultCode');
const jutils = require('jingtum-lib').utils;
const CURRENCY = config.get('base_currency') || 'SWT';

let jingtumService = {};

String.prototype.startWith = function (str) {
    let reg = new RegExp("^" + str);
    return reg.test(this);
};

String.prototype.endWith = function (str) {
    let reg = new RegExp(str + "$");
    return reg.test(this);
};

/**
 * 从银关中获取所有的代币
 */
jingtumService.getTokensFromGate = function () {
    return new Promise((resolve, reject) => {
        let options = {
            account: issuer,
        };
        let req = remote.requestAccountTums(options);
        req.submit((error, result) => {
            if (error) {
                reject(error)
            }
            else if (result) {
                resolve(result.receive_currencies);
            }
        })
    })
}


jingtumService.queryLedger = function (hash) {
    return new Promise(((resolve, reject) => {
        if (!remote || !remote.isConnected()) {
            logger.error(resultCode.N_REMOTE.msg);
            return callback(new NetworkError(resultCode.N_REMOTE));
        }
        let req = remote.requestLedger({
            ledger_hash: hash,
            transactions: true
        });
        req.submit(function (err, ledger) {
            if (err) {
                console.log('err:', err);
                reject({success: false, msg: err});
            }
            else if (ledger) {
                // 获取账本相关交易列表
                let txs = [];
                ledger.transactions.forEach((txHash, index) => {
                    (function (txHash) {
                        let req = remote.requestTx({
                            hash: txHash,
                        });
                        req.submit(function (err, transaction) {
                            if (err) {
                                console.log('err:', err);
                            }
                            else if (transaction) {
                                txs.push(transaction);
                                if (txs.length === ledger.transactions.length) {
                                    ledger.transactions = txs;
                                    resolve(ledger);
                                }
                            }
                        });
                    })(txHash);
                });
            }
        });

    }))
};

/**
 * 在此方法中并不迭代账本中的每一次交易的具体信息
 * @param index
 */
jingtumService.queryLedgerByIndex = function (index) {
    return new Promise((resolve, reject) => {
        if (!remote || !remote.isConnected()) {
            logger.error(resultCode.N_REMOTE.msg);
            return new NetworkError(resultCode.N_REMOTE);
        }
        let req = remote.requestLedger({
            ledger_index: index + '',
            transactions: true
        });
        logger.info('ledgerIndex', index);
        req.submit(function (err, ledger) {
            if (err) {
                reject({err: err});
                logger.error(err)
            }
            else if (ledger) {
                resolve(ledger);
            }
        });
    })
};

jingtumService.queryLedgersPaging = function (page, limit) {
    /**
     * 思路，首先查询节点服务器中最新账本，然后根据账本index，往下顺延(page-1)*limit个
     * 账本，获取limit个账本
     */
    return new Promise(function (resolve, reject) {
        jingtumService.getLatestLedger().then(function (result) {
            jingtumService.queryLedgerByIndex(result.ledger_index).then(async function (ledgerLatest) { // 获取最新的账本完整数据
                let ledgers = [];
                ledgers.push(ledgerLatest);
                let from = ledgerLatest.ledger_index - 1 - (page - 1) * limit;
                let to = ledgerLatest.ledger_index - page * limit;
                for (let index = from; index > to; index--) {
                    let ledger = await jingtumService.queryLedgerByIndex(index);
                    ledgers.push(ledger);
                }
                resolve(ledgers);
            }).catch(function (error) {
                reject(error);
            })
        }).catch(function (error) {
            reject(error);
        })
    });
};

jingtumService.queryTransactionsPaging = function (page, limit) {
    return new Promise((resolve, reject) => {
        localService.getTransactionsPaging(page, limit).then((transactions) => {
            localService.getTransactionsCount().then((count) => {
                let tempTransactions = transactions.map((transaction, index) => {
                    let date = util.generate2000(new Number(transaction.date), 'yyyy-MM-dd hh:mm:ss');
                    return {
                        hash: transaction.hash,
                        Amount: transaction.Amount,
                        date: date,
                        TransactionType: transaction.TransactionType,
                        Destination: transaction.Destination
                    }
                });
                resolve({total: count, transactions: tempTransactions})
            }).catch(error => {
                logger.error(error);
                reject(error)
            })
        }).catch(function (error) {
            logger.error(error);
            reject(error)
        })
    })
};

/**
 * 从节点服务器获取最新账本数据
 */
jingtumService.getLatestLedger = function () {
    return new Promise(function (resolve, reject) {
        if (!remote || !remote.isConnected()) {
            logger.error(resultCode.N_REMOTE.msg);
            return new NetworkError(resultCode.N_REMOTE);
        }
        let req = remote.requestLedgerClosed();
        req.submit(function (err, result) {
            if (err) {
                logger.info('err', err);
                reject({err: err});
            } else {
                resolve(result);
            }
        })
    });
};

jingtumService.queryTxs = function (txHashs) {
    let txs = [];
    for (let index = 0; index < txHashs.length; index++) {
        (function (index) {
            jingtumService.queryTx(txHashs[index]).then(transaction => {
                txs.push(transaction);
            })
        })(index);
    }
    return new Promise((resolve, reject) => {
        resolve(txs);
    })
};


/**
 * 通过issuer或者currency分页查询token代币
 * @param page
 * @param limit
 * @param param
 * @returns {Promise}
 */
jingtumService.queryTokens = function (page, limit, param) {
    return new Promise(function (resolve, reject) {
        if (!param) {
            localService.getTokensPaging(page, limit).then(function (tokens) {
                localService.getTokensCount().then(function (count) {
                    resolve({total: count, tokens: tokens})
                }).catch(function (error) {
                    logger.error(error);
                    reject(error);
                })
            }).catch(function (error) {
                logger.error(error);
                reject(error);
            })
        } else if (jutils.isValidCurrency(param)) {
            localService.getTokensCurrencyPaging(page, limit, param).then(function (tokens) {
                localService.getTokensCount().then(function (count) {
                    resolve({total: count, tokens: tokens})
                }).catch(function (error) {
                    logger.error(error);
                    reject(error);
                })
            }).catch(function (error) {
                logger.error(error);
                reject(error);
            })
        } else {
            localService.getTokensByIssuerPaging(page, limit, param).then(function (tokens) {
                localService.getTokensCount().then(function (count) {
                    resolve({total: count, tokens: tokens})
                }).catch(function (error) {
                    logger.error(error);
                    reject(error);
                })
            }).catch(function (error) {
                logger.error(error);
                reject(error);
            })
        }
    })
};

/**
 * 查询token代币的持仓排名
 * @param page
 * @param limit
 * @param issuer
 * @param currency
 * @returns {Promise}
 */
jingtumService.queryRankings = function (page, limit, issuer, currency) {
    return new Promise(function (resolve, reject) {
        localService.getRankingPaging(page, limit, currency, issuer).then(function (balances) {
            localService.getToken({currency: currency, issuer: issuer}).then(function (token) {
                let balancesDataValues = balances.map(function (balance, index, input) {
                    balance.dataValues.percentage = balance.dataValues.value / token.dataValues.total * 100 + '%';
                    return balance.dataValues;
                });
                localService.getBalanceCount({currency: currency, issuer: issuer}).then(function (count) {
                    resolve({total: count, rankings: balancesDataValues})
                })
            }).catch(function (error) {
                logger.error(error);
                reject(error);
            })
        }).catch(function (error) {
            logger.error(error);
            reject(error);
        })
    })
};

jingtumService.queryTx = function (hash) {
    return new Promise((resolve, reject) => {
        if (!remote || !remote.isConnected()) {
            logger.error(resultCode.N_REMOTE.msg);
            return new NetworkError(resultCode.N_REMOTE);
        }
        let req = remote.requestTx({
            hash: hash,
        });
        req.submit(function (err, transaction) {
            if (err) {
                reject(err);
                console.log('err:', err);
            }
            else if (transaction) {
                resolve(transaction);
            }
        });
    })
};

jingtumService.queryWalletLib = function (address) {
    return new Promise(function (resolve, reject) {
        // let count = page * limit;
        jingtumService.queryBalance(address).then(function (balances) {

            jingtumService.queryAccountTx(address).then(function (transactions) {
                let wallet = balances;
                wallet.total = transactions.transactions.length;
                /**
                 * 处理交易信息，将不同类型的交易sent,received,offernew,offercancel,offereffect
                 * 做归一化处理
                 */
                wallet.transactions = [];
                transactions.transactions.forEach(function (tx) {
                    let transaction = {};
                    if (tx.type === 'offereffect') {
                        transaction.counterparty = tx.effects[0].counterparty.account;
                        transaction.amount = tx.effects[0].paid.value + tx.effects[0].paid.currency + '--->' +
                            tx.effects[0].got.value + tx.effects[0].got.currency;
                    } else if (tx.type.startWith('offer')) {
                        if (tx.pays && tx.gets) {
                            transaction.amount = tx.pays.value + tx.pays.currency + '--->' + tx.gets.value + tx.gets.currency;
                            transaction.counterparty = '';
                        }
                    } else {
                        transaction.amount = tx.amount.value;
                        transaction.counterparty = tx.counterparty;
                    }
                    transaction.date = tx.date;
                    transaction.type = tx.type;
                    transaction.hash = tx.hash;
                    wallet.transactions.push(transaction);
                });
                resolve(wallet);
            }).catch(function (error) {
                reject(error);
            });
        }).catch(function (error) {
            reject(error);
        })
    })
};

/**
 * 通过账户地址获取账户交易
 * @param address
 * @param count 交易返回数量
 */
jingtumService.queryAccountTx = function (address) {
    return new Promise(function (resolve, reject) {
        if (!remote || !remote.isConnected()) {
            logger.error(resultCode.N_REMOTE.msg);
            reject(NetworkError(resultCode.N_REMOTE));
        }
        let req = remote.requestAccountTx({account: address, limit: 1000});
        req.submit(function (err, transactions) {
            if (err) {
                logger.info('err', err);
                reject(err);
            } else {
                resolve(transactions);
            }
        })
    })
};

jingtumService.queryBalance = function (address) {
    return new Promise(function (resolve, reject) {
        if (!address || !jutils.isValidAddress(address)) {
            return new ClientError(resultCode.C_ADDRESS);
        }
        if (!remote || !remote.isConnected()) {
            logger.error(resultCode.N_REMOTE.msg);
            return new NetworkError(resultCode.N_REMOTE);
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
                resolve(jingtumService.process_balance(results, condition));
            }
        });
    })
};

jingtumService.process_balance = function (data, condition) {
    let swt_value = new Number(data.native.account_data.Balance) / 1000000.0;
    let freeze0 = config.get('freezed').reserved
        + (data.lines.lines.length + data.orders.offers.length) * config.get('freezed').each_freezed;
    let swt_data = {value: swt_value + '', currency: CURRENCY, issuer: '', freezed: freeze0 + ''};
    let _data = [];
    if ((!condition.currency && !condition.issuer) || condition.currency && condition.currency === CURRENCY) {
        _data.push(swt_data);
    }

    for (let i = 0; i < data.lines.lines.length; ++i) {
        if (condition.currency && condition.currency === CURRENCY) {
            break;
        }
        let item = data.lines.lines[i];
        let tmpBal = {value: item.balance, currency: item.currency, issuer: item.account, freezed: '0'};
        let freezed = 0;
        data.orders.offers.forEach(function (off) {
            let taker_gets = jutils.parseAmount(off.taker_gets);
            if (taker_gets.currency === swt_data.currency && taker_gets.issuer === swt_data.issuer) {
                let tmpFreezed = parseFloat(swt_data.freezed) + parseFloat(taker_gets.value);
                swt_data.freezed = tmpFreezed + '';
            } else if (taker_gets.currency === tmpBal.currency && taker_gets.issuer === tmpBal.issuer) {
                freezed += parseFloat(taker_gets.value);
            }
        });
        for (let j = 0; j < data.lines2.lines.length; j++) {
            let l = data.lines2.lines[j];
            if (l.currency === tmpBal.currency && l.issuer === tmpBal.issuer) {
                freezed += parseFloat(l.limit);
            }
        }

        tmpBal.freezed = parseFloat(tmpBal.freezed) + freezed;
        tmpBal.freezed = tmpBal.freezed.toFixed(6) + '';
        if (condition.currency && (condition.currency !== tmpBal.currency)) {
            continue;
        }
        if (condition.issuer && (condition.issuer !== tmpBal.issuer)) {
            continue;
        }

        _data.push(tmpBal);
    }

    let _ret = {
        "balances": _data,
        "sequence": data.native.account_data.Sequence
    };
    return _ret;
}

module.exports = jingtumService;