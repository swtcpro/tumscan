/**
 \* Created with IntelliJ IDEA.
 \* User: 彭诗杰
 \* Date: 2018/5/15
 \* Time: 15:05
 \* Description:
 \*/
import 'babel-polyfill'; // mocha 支持es6的需要的设置
import sequelize from '../src/model/sequelize_helper';
import messageBoard from '../src/model/messageBoard';
import entities from '../src/model/entities'
import Account from "../src/model/account";
import TimeTask from '../src/common/timed_task'

const logger = require('../src/lib/logger');
const remote = require('../src/lib/remote');
const should = require('should');
let jingtumService = require('../src/service/jingtum_service');


describe('#dataOrm()', () => {
    it('orm test', () => {
        sequelize
            .authenticate()
            .then(() => {
                console.log('Connection has been established successfully.');
            })
            .catch(err => {
                console.error('Unable to connect to the database:', err);
            });
    });
    it('should return a account', function () {
        entities.Account.create({address: 'jsMwaJ7EA4y7QgdvQzaD2CqzQQN4v7vLFK'})
            .then(() => Account.findOrCreate({where: {address: 'jsMwaJ7EA4y7QgdvQzaD2CqzQQN4v7vLFK'}}))
            .spread((account, created) => {
                console.log(account);
                should.exist(account);
            })
    });
    it("model test", () => {
        messageBoard.sync().then(() => {
            messageBoard.all().then(messageBoard => {
                console.log(messageBoard);
            });
        });
    });
    it('should return the largest index of ledgers', function () {
        entities.Ledger.max('ledger_index').then(ledger_index => {
            logger.info('test:', ledger_index);
            ledger_index.should.be.a.Number();
        })
    });

});

describe('#jingtumLib()', function () {
    describe('ledger tests', function () {
        it('query single ledger test', function () {
            jingtumService.queryLedger("F589E0BC80AFA14216E2D94837E27E96A5A94C771918867291DB4E22E685975D");
        });
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

    it.only('timed_task countTokenAndBalances test', () => {
        remote.connect((err, result) => {
            if (err) {
                return console.log('err', err);
            }
            TimeTask.countTokenAndBalances();
        });
    })

});