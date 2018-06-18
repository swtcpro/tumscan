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

const logger = require('../src/lib/logger');
const should = require('should');
import localService from "../src/service/local_service";


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

    it.only('should return a set of balances', function () {
        localService.getRankingPaging(1, 20, 'SWT', 'SWT').then(function (balances) {
            logger.info(balances.length);
            balances.should.be.a.Array();
            balances.should.have.length(20);
        })
    });

    it.only('should return paging tokens', function () {
        localService.getTokensPaging(1, 20).then(function (tokens) {
            logger.info(tokens.length);
        })
    })

});


