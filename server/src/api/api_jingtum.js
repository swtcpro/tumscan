/**
 \* Created with IntelliJ IDEA.
 \* User: 彭诗杰
 \* Date: 2018/4/17
 \* Time: 14:37
 \* Description:
 \*/
import * as API from './index'

export default {
    // 检验钱包地址、交易哈希值是否存在
    verifyWalletAndHash: pathVariable => {
        return API.GET('/query/type/' + pathVariable);
    },

    //
    init: () => {
        return API.GET('/init');
    },
    // 查询和钱包相关的信息
    queryWallent: (address, params) => {
        return API.GET('/query/wallet/' + address + '/10', params);
    },
    // 查询单个交易的信息
    queryTx: hash => {
        return API.GET('/query/tx/' + hash);
    },

    // 查询钱包余额
    // findBalancesByAddress: address => {
    //     return API.GET('/jingtum/accounts/' + address + '/balances');
    // },

    // 查询账号下所有交易
    findTranscationsByAddress: address => {
        // return API.GET('/jingtum/accounts/' + address + '/transactions');
    }
}