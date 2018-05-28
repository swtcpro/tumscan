/**
 \* Created with IntelliJ IDEA.
 \* User: 彭诗杰
 \* Date: 2018/5/15
 \* Time: 15:05
 \* Description:
 \*/
import 'babel-polyfill'; // mocha 支持es6的需要的设置
import sequelize from '../src/model/sequelize_helper';
let jingtumService = require('../src/service/jingtum_service');
let assert = require('assert');
import messageBoard from '../src/model/messageBoard';

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
        it.only('query single transaction test', function () {
            let result = {};
            new Promise(function () {
                result = jingtumService.queryTx('68E502101C2E0644BC0BFE59665F533706A7FD8CABF579448EDEC526C66C9244');
            }).then(function () {
                console.log(result);
            });
        })
    });
});

describe("#modelQuery()", () => {
  it("model test", () => {
    messageBoard.sync().then(() => {
      messageBoard.all().then(messageBoard => {
        console.log(messageBoard);
      });
    });
  });
});
