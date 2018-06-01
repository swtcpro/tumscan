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

const CURRENCY = 'SWT';

/**
 * 遍历指定的账本
 * @param from 开始的账本高度
 * @param to 结束的账本高度
 */
function traverseLedgers(from, to) {
    if (!remote || !remote.isConnected()) {
        logger.error(resultCode.N_REMOTE.msg);
        return callback(new NetworkError(resultCode.N_REMOTE));
    }
}

