/**
 \* Created with IntelliJ IDEA.
 \* User: 彭诗杰
 \* Date: 2018/5/16
 \* Time: 22:42
 \* Description:
 \*/
const jlib = require('jingtum-lib');
const Remote = jlib.Remote;
const remote = new Remote({server: 'wss://c05.jingtum.com:5020', local_sign: true});
const co = require('co');

let jingtumService = {}

jingtumService.queryLedger = function (hash) {
    return new Promise(((resolve, reject) => {
        if (remote.isConnected()) {
            remote.disconnect();
        }
        remote.connect(function (err, result) {
            if (err) {
                console.log('err:', err);
                return {success: false, error: err}
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
                                        remote.disconnect();
                                        resolve(ledger);
                                    }
                                }
                            });
                        })(txHash);
                    });
                }
            });
        });
    }))
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

jingtumService.queryTokens = function (address) {
    return new Promise((resolve, reject) => {
        if (remote.isConnected()) {
            remote.disconnect();
        }
        remote.connect((err, result) => {
            if (err) {
                return console.log(err);
            }
            let options = {account: address};
            let req = remote.requestAccountTums(options);
            req.submit((err, result) => {
                if (err) {
                    console.log('err:', err);
                }
                else if (result) {
                    // console.log('res:', result);
                    resolve(result);
                }
            });
        });
    });
};

jingtumService.queryTx = function (hash) {
    return new Promise((resolve, reject) => {

        remote.connect(function (err, result) {
            if (err) {
                console.log('err:', err);
                return {success: false, error: err}
            }
            let req = remote.requestTx({
                hash: hash,
            });
            req.submit(function (err, transaction) {
                if (err) {
                    console.log('err:', err);
                }
                else if (transaction) {
                    remote.disconnect();
                    resolve(transaction);
                }
            });
        });
    })
};

module.exports = jingtumService;