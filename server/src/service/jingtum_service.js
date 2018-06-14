/**
 \* Created with IntelliJ IDEA.
 \* User: 彭诗杰
 \* Date: 2018/5/16
 \* Time: 22:42
 \* Description:
 \*/
import localService from "./local_service";

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
const respond = require('../lib/respond');
const CURRENCY = config.get('base_currency') || 'SWT';

let jingtumService = {}

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
                return {success: false, msg: err}
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
                console.log('err:', err);
            }
            else if (ledger) {
                resolve(ledger);
            }
        });
    })
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
                    reject(error);
                })
            }).catch(function (error) {
                reject(error);
            })
        } else if (jutils.isValidCurrency(param)) {
            logger.info('goes to currency')
            localService.getTokensCurrencyPaging(page, limit, param).then(function (tokens) {
                localService.getTokensCount().then(function (count) {
                    resolve({total: count, tokens: tokens})
                }).catch(function (error) {
                    reject(error);
                })
            }).catch(function (error) {
                reject(error);
            })
        } else {
            localService.getTokensByIssuerPaging(page, limit, param).then(function (tokens) {
                localService.getTokensCount().then(function (count) {
                    resolve({total: count, tokens: tokens})
                }).catch(function (error) {
                    reject(error);
                })
            }).catch(function (error) {
                reject(error);
            })
        }
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


jingtumService.queryBalance = function (req, res, callback) {
    let address = _.trim(req.params.address || '');
    console.log(address);
    if (!address || !jutils.isValidAddress(address)) {
        return callback(new ClientError(resultCode.C_ADDRESS));
    }
    if (!remote || !remote.isConnected()) {
        logger.error(resultCode.N_REMOTE.msg);
        return callback(new NetworkError(resultCode.N_REMOTE));
    }
    let condition = {};
    if (req.query.currency) {
        if (!jutils.isValidCurrency(req.query.currency)) {
            return callback(new ClientError(resultCode.C_CURRENCY));
        }
        condition.currency = req.query.currency;
    }
    if (req.query.issuer) {
        if (!jutils.isValidAddress(req.query.issuer)) {
            return callback(new ClientError(resultCode.C_ISSUER));
        }
        condition.issuer = req.query.issuer;
    }

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
            respond.transactionError(res, error);
        } else {
            respond.success(res, process_balance(results, condition));
        }
    });
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