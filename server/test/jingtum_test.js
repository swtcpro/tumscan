import 'babel-polyfill';
import TimeTask from "../src/common/timed_task"; // mocha 支持es6的需要的设置
let jingtumService = require('../src/service/jingtum_service');
const logger = require('../src/lib/logger');
const should = require('should');
const remote = require('../src/lib/remote');

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

    it.only('通过钱包地址返回钱包余额', function () {
        remote.connect(function (err, result) {
            if (err) {
                return console.log('err', err);
            }
            jingtumService.queryWalletLib('j4Zdsk3tQSvQ4aEiaN1BD2Wk3ztzBBRWHc').then(function (result) {
                result.should.be.a.Object();
            })
        })
    });

    it.only('通过钱包地址返回钱包余额和交易', function () {
        remote.connect(function (err, result) {
            if (err) {
                return console.log('err', err);
            }
            jingtumService.queryWalletLib('j4Zdsk3tQSvQ4aEiaN1BD2Wk3ztzBBRWHc').then(function (wallet) {
                logger.info(wallet)
                wallet.should.be.a.Object();
            })
        })
    });

    describe('tum tests', function () {
        it('query tums test', () => {
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