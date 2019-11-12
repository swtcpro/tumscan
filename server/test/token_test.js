import 'babel-polyfill';
import tumUtils from "../src/common/tum_utils"; // mocha 支持es6的需要的设置
const logger = require('../src/lib/logger');
const should = require('should');
const remote = require('../src/lib/remote');
import tokenService from '../src/service/token_service'
import tokenRep from "../src/repository/token_rep";
import balanceRep from '../src/repository/balance_rep';

describe('tum_utils文件', function () {
    it.only('getAccountsFromToken函数测试', function (done) {
        this.timeout(0);
        remote.connect((err, result) => {
            if (err) {
                return logger.info(err);
            }
            tumUtils.getAccountsFromToken('YUT').then(result => {
                logger.info(result);
                result.should.be.a.Object();
                done();
            }).catch(error => {
                logger.error(error)
                done();
            })
        });
    });


});

describe('新的测试用例', function () {
    it.only('token_service的tokenInit', function (done) {
        this.timeout(0);
        remote.connect((err, result) => {
            if (err) {
                return logger.info(err);
            }
            tokenService.tokenInit().then(twoDAccounts => {
                logger.info(twoDAccounts);
                result.should.be.a.Object();
                done();
            }).catch(error => {
                logger.error(error);
                done();
            })
        });
    });

    it.only('token_service的tokenInit2', function (done) {
        this.timeout(0);
        remote.connect((err, result) => {
            if (err) {
                return logger.info(err);
            }
            tokenService.tokenInit2().then(savedTokens => {
                logger.info(savedTokens);
                result.should.be.a.Object();
                done();
            }).catch(error => {
                logger.error(error);
                done();
            })
        });
    });

    it.only('token_service的tokenInit3', function (done) {
        this.timeout(0);
        remote.connect((err, result) => {
            if (err) {
                return logger.info(err);
            }
            tokenService.tokenInit3().then(savedTokens => {
                logger.info(savedTokens);
                result.should.be.a.Object();
                done();
            }).catch(error => {
                logger.error(error)
                done();
            })
        });
    });

    it.only('tokenInit的countAllTokensTotal', function (done) {
        this.timeout(0);
        remote.connect((err, result) => {
            if (err) {
                return logger.error(err);
            }
            tokenService.countAllTokensTotal().then(() => {
                done();
            }).catch(error => {
                logger.error(error);
                done();
            })
        });
    });

    it.only('tokenInit的countTokenTotal', function (done) {
        this.timeout(0);
        remote.connect((err, result) => {
            if (err) {
                return logger.info(err);
            }
            tokenService.countTokenTotal({
                currency: '520',
                issuer: 'jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or'
            }).then(result => {
                logger.info('result: ', result);
                result.should.be.a.Object();
                done();
            }).catch(error => {
                logger.error(error);
                done();
            })
        });
    });
});


describe('token database tests', () => {
    it.only('findByToken接口', function () {
        remote.connect((err, result) => {
            if (err) {
                return logger.error(err);
            }
            balanceRep.findByToken({currency: 'USD'}).then(balances => {
                balances.should.be.a.Array();
                logger.info(balances.length);
            }).catch(error => {
                logger.error(error);
            })
        });
    });
});

describe('下载公链中所有账本计划', function () {
    it.only('8百万-9百万高度账本', function () {
        remote.connect(function (err, result) {
            if (err) {
                return console.log('err', err);
            }
            Promise.all([
                //TimeTask.manualSync(8344064, 8400000),
                TimeTask.manualSync(8126141, 8500000, 8000000, 8500000),
                TimeTask.manualSync(8625847, 9000000, 8500000, 9000000),
                //TimeTask.manualSync(8700000, 8800000),
            ]).then(function (savedLedgers) {
                savedLedgers.should.be.a.Array();
            }).catch(function (r) {
                console.log("err");
                console.log(r);
            })
        })
    });
    it.only('6百万-7百万高度账本', function () {
        remote.connect(function (err, result) {
            if (err) {
                return console.log('err', err);
            }
            Promise.all([
                //TimeTask.manualSync(8344064, 8400000),
                TimeTask.manualSync(6500000, 6500000, 6000000, 6500000),
                TimeTask.manualSync(7000000, 7000000, 6500000, 7000000),
                //TimeTask.manualSync(8700000, 8800000),
            ]).then(function (savedLedgers) {
                savedLedgers.should.be.a.Array();
                logger.info('6百万-7百万高度账本下载完成')
            }).catch(function (r) {
                console.log("err");
                console.log(r);
            })
        })
    });
    it.only('5百万-6百万高度账本', function (done) {
        this.timeout(0);
        remote.connect(function (err, result) {
            if (err) {
                return console.log('err', err);
            }
            TimeTask.syncOneByOne(5924096, 6000000).then(function () {
                logger.info('指定同步范围syncOneByOne完成!')
                done();
            }).catch(function (error) {
                logger.info(error);
                done(error);
            })
        });
    });
})
