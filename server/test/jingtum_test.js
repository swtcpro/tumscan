import 'babel-polyfill';
import tumUtils from "../src/common/tum_utils"; // mocha 支持es6的需要的设置
let jingtumService = require('../src/service/jingtum_service');
const logger = require('../src/lib/logger');
const should = require('should');
const remote = require('../src/lib/remote');
import {sequelize, Sequelize} from '../src/model/sequelize_helper';

describe('#jingtumLib()', function () {
    describe('ledger tests', function () {
        it('query single ledger test', function () {
            jingtumService.queryLedger("F589E0BC80AFA14216E2D94837E27E96A5A94C771918867291DB4E22E685975D");
        });
    });

    it.only('should return a set of ledgers', function () {
        remote.connect((err, result) => {
            if (err) {
                return console.log('err', err);
            }
            jingtumService.queryLedgersPaging(1, 20).then(function (ledgers) {
                ledgers.should.be.a.Array();
                ledgers.should.have.length(20);
            }).catch(function (error) {
                logger.error(error);
            })
        });

    });

    it.only('测试新生成的交易', function () {
        sequelize.sync().then(function () {
            remote.connect(function (err, result) {
                if (err) {
                    return console.log('err', err);
                }
                remote.on('transactions', function (tx) {
                    // logger.info('remote get transactions:',tx);
                    tumUtils.processTx(tx).then(function (transaction) {
                        logger.info('processTx完成!')
                    }).catch(function (error) {
                        logger.info(error)
                    })
                });
            })
        })
    });

    it.only('通过钱包地址返回钱包余额', function () {
        remote.connect(function (err, result) {
            if (err) {
                return console.log('err', err);
            }
            jingtumService.queryWalletLib('jsMwaJ7EA4y7QgdvQzaD2CqzQQN4v7vLFK').then(function (result) {
                result.should.be.a.Object();
                logger.info(result.transactions.length);
            }).catch(function (error) {
                logger.info(error);
            })
        })
    });

    it.only('通过钱包地址返回钱包余额和交易', function () {
        remote.connect(function (err, result) {
            if (err) {
                return console.log('err', err);
            }
            jingtumService.queryWalletLib('jEkffY8XtkEtkUKyYQT1Fv7MDp3grAtwdH').then(function (wallet) {
                logger.info(wallet)
                wallet.should.be.a.Object();
            })
        })
    });

    it.only('通过hash查询指定交易', function (done) {
        remote.connect(function (err, result) {
            if (err) {
                return console.error('err', err);
            }
            jingtumService.queryTx('B40C0B37273FAE892573146882F806CA90E475CB69062D62AF3FAEA9E2D7783C').then(function (tx) {
                logger.info(tx)
                tx.should.be.a.Object();
                done()
            }).catch(function (error) {
                logger.error(error);
                done();
            })
        })
    })

    it.only('分页查询代币列表', function () {
        jingtumService.queryTokens(1, 20, '').then(function (tokens) {
            tokens.should.be.an.Object();
        }).catch(function (error) {
            logger.error(error);
        })
    });

    describe('tum tests', function () {
        it.only('query tums test', () => {
            jingtumService.queryTokens('jGa9J9TkqtBcUoHe2zqhVFFbgUVED6o9or').then(result => {
                console.log(result);
            });
        })
    });

    describe('transaction tests', function () {
        it('query single transaction test', function () {
            let result = {};
            new Promise(function () {
                result = jingtumService.queryTx('68E502101C2E0644BC0BFE59665F533706A7FD8CABF579448EDEC526C66C9244');
            }).then(function () {
                console.log(result);
            });
        })
    });
});