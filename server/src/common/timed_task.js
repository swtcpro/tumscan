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

const CURRENCY = 'SWT';

/**
 * 遍历指定的账本，检索其中的交易信息，如果是买入或者卖出的交易则记录交易双方的address
 * 也就是统计全网中所有的账户
 * @param from 开始的账本高度
 * @param to 结束的账本高度
 */
function traverseLedgers(from, to) {
    if (!remote || !remote.isConnected()) {
        logger.error(resultCode.N_REMOTE.msg);
        return callback(new NetworkError(resultCode.N_REMOTE));
    }

    let ledgers = [];

    for (let ledgerIndex = from; ledgerIndex <= to; ledgerIndex++) {
        ledgers.push(jingtumService.queryLedgerByIndex(ledgerIndex));
    }

}

/**
 * 分析账本中交易，将其sent和received类型交易中交易双方
 * 的地址分析、抽取出来
 * @param ledgers
 */
function analyseLedgerTransactions(ledgers) {

}

