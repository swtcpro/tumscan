/**
 \* Created with IntelliJ IDEA.
 \* @author: 彭诗杰
 \* @time: 2019/3/7 19:59
 \* Description: 代币模块逻辑层代码
 \*/

import tumUtils from '../common/tum_utils'
import tokenRep from '../repository/token_rep'
import balanceRep from '../repository/balance_rep'

const jlib = require('jingtum-lib');
const remote = require('../lib/remote');
const logger = require('../lib/logger');
const config = require('../lib/config');
const ClientError = require('../lib/errors').ClientError;
const NetworkError = require('../lib/errors').NetworkError;
const resultCode = require('../lib/resultCode');
const jutils = require('jingtum-lib').utils;
const CURRENCY = config.get('base_currency') || 'SWT';
const gate = config.get('issuer');

let tokenService = {};

/**
 * 启用
 *
 * @return {Promise}
 */
tokenService.tokenInit = function () {
    return new Promise(async (resolve, reject) => {
        let options = {
            account: gate,
            type: 'trust',
            marker: ''
        };
        try {
            let accounts = [];
            let tokens = [];
            do {
                let result = await tumUtils.requestGateRelation(options);
                options.marker = result.marker;
                for (let line of result.lines) {
                    if (line.currency !== 'CNY') {
                        let savedToken = await tokenRep.save({currency: line.currency});
                        tokens.push(savedToken);
                        let balance = 0.0;
                        if (line.balance.startsWith('-')) {
                            balance = parseFloat(line.balance.substring(1));
                        }
                        if (!tumUtils.isStrEmpty(line.currency) && balance !== 0) {
                            balanceRep.save(savedToken, {
                                address: line.account,
                                currency: line.currency,
                                value: balance
                            });
                            accounts.push({address: line.account, balance: balance})
                        }
                    }
                }
            } while (!tumUtils.isStrEmpty(options.marker));

            // 计算各代币的total总量
            if (tokens) {
                for (let token of tokens) {
                    await tokenService.countTokenTotal(token);
                }
            }
        } catch (e) {
            reject(e)
        }
        resolve('token init 成功');
    })
};

tokenService.countAllTokensTotal = function() {
    return new Promise(async (resolve, reject) => {
        try {
            let tokens = await tokenRep.getAllTokens();
            if (tokens) {
                for (let token of tokens) {
                    await tokenService.countTokenTotal(token);
                }
            }
            resolve();
        } catch (e) {
            reject(e)
        }
    })
}

/**
 * 弃用
 * @return {Promise}
 */
tokenService.tokenInit2 = function () {
    return new Promise(async (resolve, reject) => {
        try {
            let tokensArrs = await tumUtils.getTokensFromGate();
            let savedTokens = [];
            for (let item of tokensArrs) {
                let savedToken = await saveTokenAndBalances(item);
                if (savedToken) {
                    await tokenService.countTokenTotal(savedToken);
                    savedTokens.push(savedToken);
                }
            }
            // let savedTokens = await tokensArrs.map(item => saveTokenAndBalances(item));
            resolve(savedTokens);
        } catch (e) {
            reject(e)
        }
    })
};

/**
 * 弃用
 * @return {Promise}
 */
tokenService.tokenInit3 = function () {
    return new Promise(async (resolve, reject) => {
        try {
            let tokens = await getAndSaveAllTokens();
            // logger.info(tokens)
            for (let token of tokens) {
                await saveTokenAndBalances(token.currency);
            }
            resolve(tokens)
        } catch (e) {
            reject(e)
        }
    })
};

function getAndSaveAllTokens() {
    return new Promise(async (resolve, reject) => {
        try {
            let tokensArrs = await tumUtils.getTokensFromGate();
            let savedTokens = [];
            for (let item of tokensArrs) {
                savedTokens.push(await tokenRep.save({currency: item}));
            }
            resolve(savedTokens)
        } catch (e) {
            reject(e)
        }
    })
}

/**
 * 保存代币以及代币所关联的账户余额
 * @param item 代币名称
 */
function saveTokenAndBalances(item) {
    return new Promise(async (resolve, reject) => {
        try {
            if (item !== 'CNY') {
                let savedToken = await tokenRep.save({currency: item});
                let accounts = await tumUtils.getAccountsFromToken(savedToken.currency);
                let savedBalances = await accounts.map(account => balanceRep.save(savedToken,
                    {address: account.address, currency: item, value: account.balance}));
                resolve(savedToken);
            } else {
                resolve();
            }
        } catch (e) {
            reject(e)
        }
    })
}

/**
 * 统计代币总额
 * @param token
 * @return {Promise}
 */
tokenService.countTokenTotal = function (token) {
    return new Promise(async (resolve, reject) => {
        try {
            let balances = await balanceRep.findByToken(token);
            let total = 0.0;
            balances.forEach(item => total += item.dataValues.value);
            await tokenRep.update({currency: token.currency, issuer: gate, total: total});
            resolve();
        } catch (e) {
            reject(e);
        }
    })
}

module.exports = tokenService;