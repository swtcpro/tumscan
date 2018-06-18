import 'babel-polyfill'; // mocha 支持es6的需要的设置

const logger = require('../src/lib/logger');
const remote = require('../src/lib/remote');
import TimeTask from "../src/common/timed_task";

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

    it.only('timed_task initSync test', function () {
        remote.connect((err, result) => {
            if (err) {
                return console.log('err', err);
            }
            TimeTask.initSync().then(function (savedLedgers) {
                savedLedgers.should.be.a.Array();
            });
        })
    });

    it('timed_task countTokenAndBalances test', () => {
        remote.connect((err, result) => {
            if (err) {
                return console.log('err', err);
            }
            TimeTask.countTokenAndBalances();
        });
    })

});