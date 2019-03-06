/**
 \* Created with IntelliJ IDEA.
 \* User: 彭诗杰
 \* Date: 2018/7/8
 \* Time: 0:13
 \* Description: 该文件为井通交易相关的工具集
 \*/

const logger = require('../lib/logger');
const remote = require('../lib/remote');
const config = require('../lib/config');
var libUtils = require('../lib/utils');
const util = require('util');
const issuer = config.get('issuer');
import localService from '../service/local_service'

/**
 * 从银关中获取所有的代币
 */
function getTokensFromGate() {
    return new Promise((resolve, reject) => {
        let options = {
            account: issuer,
        };
        let req = remote.requestAccountTums(options);
        req.submit((error , result) => {
            if (error) {
                reject(error)
            }
            else if (result){
                resolve(result.receive_currencies);
            }
        })
    })
}

function requestGateRalation(options) {
    return new Promise(function (resolve, reject) {
        let req = remote.requestAccountRelations(options);
        req.submit(function (err, result) {
            if (err) {
                reject(err);
            }
            else if (result) {
                resolve(result);
            }
        });
    })
}

/**
 * 分析交易类型，如果将交易存入数据库
 * @param rawTx 在公链中检测到的新生生成的交易
 */
function processTx(rawTx) {
    return new Promise(function (resolve, reject) {
        // logger.info('rawTx: ', rawTx);
        let transaction = extractAmount(rawTx);
        // logger.info('transaction: ', transaction);
        /**
         *  1将交易写入数据库，2更新代币的最新价格
         */
        localService.saveTransaction(transaction).then(function (savedTransaction) {
            resolve(transaction);
        }).catch(function (error) {
            reject(error);
        })
    })
}

/**
 * 从Payment和received类型的交易抽取出来
 * @param tx
 * @return transaction
 */
function extractAmount(tx) {
    tx.transaction.TransactionResult = tx.engine_result;
    tx.transaction.meta = tx.meta;
    tx.transaction.AffectedNodes = tx.meta.AffectedNodes;
    tx.transaction.ledger_index = tx.ledger_index;
    /**
     * 此处需要对没有的值进行初始化判断
     */
    if (typeof(tx.transaction.Destination) === 'undefined') {
        tx.transaction.Destination = ''
    }
    if (typeof (tx.transaction.Memos) === 'undefined') {
        tx.transaction.Memos = ''
    } else {
        tx.transaction.Memos = JSON.stringify(tx.transaction.Memos);
    }
    if (typeof (tx.transaction.ledger_index) === 'undefined') {
        tx.transaction.ledger_index = 0
    }
    if (typeof (tx.transaction.meta) === 'undefined') {
        tx.transaction.meta = ''
    } else {
        tx.transaction.meta = JSON.stringify(tx.transaction.meta);
    }
    if (typeof (tx.transaction.AffectedNodes) === 'undefined') {
        tx.transaction.AffectedNodes = ''
    } else {
        tx.transaction.AffectedNodes = JSON.stringify(tx.transaction.AffectedNodes);
    }
    if (typeof (tx.transaction.TransactionIndex) === 'undefined') {
        tx.transaction.TransactionIndex = 0
    }
    if (typeof (tx.transaction.TransactionResult) === 'undefined') {
        tx.transaction.TransactionResult = null
    }
    if (typeof tx.transaction.Amount !== 'string') {
        tx.transaction.Amount = JSON.stringify(tx.transaction.Amount)
    }
    return tx.transaction;
    // if (tx.transaction.TransactionType === 'Payment' || tx.transaction.TransactionType === 'received') {
    //     return tx.transaction
    // } else {
    //     return null;
    // }
}

/**
 * 从交易中抽取交易类型是Payment和received类型的交易
 * @param transaction
 * @return {'Account': '', 'Destination': ''}
 */
function extractPandR(transaction) {
    if (transaction.TransactionType === 'Payment' || transaction.TransactionType === 'received') {
        return {'Account': transaction.Account, 'Destination': transaction.Destination}
    } else {
        return null;
    }
}

const tumUtils = {
    processTx: processTx,
    getTokensFromGate: getTokensFromGate
};

export default tumUtils