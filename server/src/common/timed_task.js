/**
 \* Created with IntelliJ IDEA.
 \* User: 彭诗杰
 \* Date: 2018/5/28
 \* Time: 16:57
 \* Description: 该文件中定时任务用户同步井通区块链中账本数据
 \*/
const jutils = require('jingtum-lib').utils;
const remote = require('../lib/remote');
const respond = require('../lib/respond');
const logger = require('../lib/logger');
const resultCode = require('../lib/resultCode');
const ClientError = require('../lib/errors').ClientError;
const NetworkError = require('../lib/errors').NetworkError;
import jingtumService from '../service/jingtum_service'
import entities from '../model/entities'

const CURRENCY = 'SWT';
const INIT_LEDGER_INDEX = 266955;

let timeTask = {}

/**
 * 初始化同步：从创世账本开始，同步所有公链账本数据
 */
timeTask.initSync = function () {

};

/**
 * 普通同步，从tumscan数据库中存储最新的账本和公链中最新的账本高度对比，
 * 根据差值，同步差异账本数据
 */
timeTask.sync = function () {

};


/**
 * 遍历指定的账本，检索其中的交易信息，如果是买入或者卖出的交易则记录交易双方的address
 * 也就是统计全网中所有的账户
 * @param from 开始的账本高度
 * @param to 结束的账本高度
 */
timeTask.traverseLedgers = function (from, to) {
    return new Promise((resolve, reject) => {
        if (!remote || !remote.isConnected()) {
            logger.error(resultCode.N_REMOTE.msg);
            return new NetworkError(resultCode.N_REMOTE);
        }
        let ledgers = [];
        for (let ledgerIndex = from; ledgerIndex <= to; ledgerIndex++) {
            jingtumService.queryLedgerByIndex(ledgerIndex).then(ledger => {
                ledgers.push(ledger);
                saveLedger(ledger);
                if (ledgers.length === (to - from)) {
                    analyseLedgerTransactions(ledgers).then(() => {
                        resolve(ledgers);
                    });
                }
            })
        }
    })
};

/**
 * 将账本存在tumscan数据库
 * @param ledger
 */
function saveLedger(ledger) {
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
                    logger.info(transaction);
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

