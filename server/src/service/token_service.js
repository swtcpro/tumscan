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

tokenService.tokenInit = function () {
    return new Promise(async (resolve, reject) => {
        let options = {
            account: gate,
            type: 'trust',
            marker: ''
        };
        try {
            let accounts = [];
            do {
                let result = await tumUtils.requestGateRelation(options);
                options.marker = result.marker;
                for (let line of result.lines) {
                    if (line.currency !== 'CNY') {
                        let savedToken = await tokenRep.save({currency: line.currency});
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
        } catch (e) {
            reject(e)
        }
        resolve('token init 成功');
    })
};

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

/**
 * 将代币和持有该代币的账户和余额存入数据库
 * @param allTokenAccounts [{token: 'YUT', accounts: [{address: '', total: 123} ...]} ...]
 */
function saveAllTokenAccounts(allTokenAccounts) {
    return new Promise(async (resolve, reject) => {
        try {
            let results = [];
            for (let tokenAccounts of allTokenAccounts) {
                let savedToken = await tokenRep.save({issuer: gate, currency: tokenAccounts.token});
                savedToken.balances = [];
                for (let account of tokenAccounts.accounts) {
                    let savedBalance = balanceRep.save(savedToken, {
                        currency: tokenAccounts.token,
                        issuer: gate,
                        address: account.address
                    });
                    savedToken.balances.push(savedBalance)
                }
                results.push(savedToken);
            }
            resolve(results);
        } catch (e) {
            reject(e)
        }
    })
}

module.exports = tokenService;