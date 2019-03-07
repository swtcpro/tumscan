/**
 \* Created with IntelliJ IDEA.
 \* @author: 彭诗杰
 \* @time: 2019/3/7 19:59
 \* Description: 代币模块逻辑层代码
 \*/

import tumUtils from '../common/tum_utils'

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
        try {
            let tokens = await tumUtils.getTokensFromGate();
            // let tokensInfo = [];
            // for (let token of tokens) {
            //     let accounts = await tumUtils.getAccountsFromToken(token);
            //     tokensInfo.push({token: token,  accounts: accounts})
            // }
            Promise.all(tokens.map(token => tumUtils.getAccountsFromToken(token))).then(tokenAccounts => {
                resolve(tokenAccounts)
            }).catch(error => {
                reject(error);
            })
        } catch (e) {
            reject(e)
        }
    })
};

/**
 * 将代币和持有该代币的账户和余额存入数据库
 * @param tokenAccounts [{token: 'YUT', accounts: [{account: '', total: 123} ...]} ...]
 */
function saveTwoDAccounts(tokenAccounts) {

}

module.exports = tokenService;