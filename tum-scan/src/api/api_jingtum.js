/**
 \* Created with IntelliJ IDEA.
 \* User: 彭诗杰
 \* Date: 2018/4/14
 \* Time: 22:18
 \* Description:
 \*/
import * as API from './'

export default {
  // 检验钱包地址、交易哈希值是否存在
  verifyWalletAndHash: pathVariable => {

    return API.GET('/jingtum/query/type/' + pathVariable);
  },

  // 查询主页相关信息（最新区块和交易）
  dashBoardInit: () => {
    return API.GET('/jingtum/init')
  },

  // 查询钱包相关信息（余额交易）
  queryWallet: params => {
    return API.GET('/jingtum/query/wallet_lib' , params);
  },

  // 查询交易相关信息
  queryTx: hash => {
    return API.GET('/jingtum/query/tx/' + hash);
  },

  // 查询账本相关信息
  queryLedger: hash => {
    return API.GET('/jingtum/query/ledger/' + hash);
  },

  // 查询钱包余额
  findBalancesByAddress: address => {
    return API.GET('/jingtum/accounts/' + address + '/balances');
  },

  // 分页查询代币
  queryTokens: params => {
    return API.GET('/jingtum/query/tokens', params);
  },

  // 分页查询持仓ranking
  queryRankings: params => {
    return API.GET('/jingtum/query/rankings', params);
  },

  // 分页查询账本
  queryLedgersPaging: params => {
    return API.GET('/jingtum/query/ledgers', params);
  },

  // 分页查询交易
  queryTransactionsPaging: params => {
    return API.GET('/jingtum/query/transactions', params);
  },

  // 查询账号下所有交易
  findTranscationsByAddress: address => {
    // return API.GET('/jingtum/accounts/' + address + '/transactions');
  }
}
