import 'babel-polyfill';
import tumUtils from "../src/common/tum_utils"; // mocha 支持es6的需要的设置
const logger = require('../src/lib/logger');
const should = require('should');
const remote = require('../src/lib/remote');
import tokenService from '../src/service/token_service'

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
                logger.error(error)
                done();
            })
        });
    });

    it.only('should return a bunch of accounts', function (done) {
        this.timeout(0);
        remote.connect((err, result) => {
            if (err) {
                return logger.info(err);
            }
            tumUtils.getTokensFromGate().then(tokens => {
                logger.info(tokens.length);
                result.should.be.a.Object();
                done();
            }).catch(error => {
                logger.error(error)
                done();
            })
        });
    });
})


describe('token tests', () => {
    it('should return a set of account', function () {
        remote.connect((err, result) => {
            if (err) {
                return console.log(err);
            }
            // TimeTask.traverseLedgers('266955', '9826175').then(ledgers => {
            TimeTask.traverseLedgers('9826155', '9826175').then(ledgers => {
                ledgers.should.be.an.instanceOf(Array);
                ledgers.should.have.length(21)
            })
        });
    });
    it('timed_task sync test', () => {
        remote.connect((err, result) => {
            if (err) {
                return console.log('err', err);
            }
            TimeTask.sync();
        });
    });

    it('timeTask countTokenRanking 测试', function () {
        TimeTask.countTokenRanking().then(function () {
            logger.info('完成测试')
        }).catch(function (error) {
            logger.info(error);
        })
    });

    it('generateBalances 测试', function () {
        remote.connect(function (err, result) {
            if (err) {
                return console.log('err', err);
            }
            TimeTask.generateBalances().then(function () {
                logger.info('generateBalances 测试完成')
            }).catch(function (error) {
                logger.info(error);
            })
        });

    })

    it('timed_task countTokenAndBalances test', () => {
        remote.connect((err, result) => {
            if (err) {
                return console.log('err', err);
            }
            TimeTask.countTokenAndBalances();
        });
    });

    it.only('根据本地数据库中账户余额统计代币', function (done) {
        this.timeout(0);
        TimeTask.countTokenRanking().then(function () {
            logger.info('根据本地数据库中账户余额统计代币完成')
            done()
        }).catch(function (error) {
            logger.error(error)
            done();
        })
    });

    it.only('测试账本高度九百万+ 1000', function () {
        remote.connect(function (err, result) {
            if (err) {
                return console.log('err', err);
            }
            logger.info("goes here")
            TimeTask.syncOneByOne(10000000, 10001000).then(function () {
                logger.info('指定同步范围syncOneByOne完成!')
            }).catch(function (error) {
                logger.info(error);
            })
        });
        // TimeTask.syncOneByOne(10000000, 10001000).then(function () {
        //     logger.info('指定同步范围syncOneByOne完成!')
        // })
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
