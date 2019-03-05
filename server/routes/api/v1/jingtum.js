/**
 \* Created with IntelliJ IDEA.
 \* User: 彭诗杰
 \* Date: 2018/4/17
 \* Time: 11:13
 \* Description: 井通相关路由
 * 采用 restful api 风格
 \*/
let express = require('express');
let router = express.Router();
let indexRouter = {};
let tumController = require('../../../src/controllers/jingtum');

// 验证地址或交易hash是否合法有效
router.get('/query/type/:variable', tumController.verifyWalletAndHash);

// 初始化主页信息
router.get('/init', tumController.homeInit);

// 查询钱包相关信息
router.get('/query/wallet/:address', tumController.queryWallet);

// 通过lib库查询钱包相关信息
router.get('/query/wallet_lib', tumController.queryWalletLib);

// 查询单个交易相关信息
router.get('/query/tx/:hash', tumController.queryTx);

// 查询单个区块相关信息
router.get('/query/ledger/:hash', tumController.queryLedger);

// 查询代币相关信息
router.get('/query/tokens', tumController.queryTokens);

// 查询代币持仓排名
router.get('/query/rankings', tumController.queryRankings);

// 分页查询账本列表数据
router.get('/query/ledgers', tumController.queryLedgersPaging);

// 分页查询近期交易列表数据
router.get('/query/transactions', tumController.queryTransactionsPaging);

// 获取钱包地址的余额相关信息
router.get('/accounts/:address/balances', tumController.queryBalancesByAddress);

// 获取钱包地址的交易信息
router.get('/accounts/:address/transactions', tumController.findTransactionsByAddress);


indexRouter.router = router;

module.exports = indexRouter;