import "babel-polyfill"; // mocha 支持es6的需要的设置
const should = require('should');
const logger = require("../src/lib/logger");
const remote = require("../src/lib/remote");
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

  it.only('timed_task manualSync test', function () {
    remote.connect(function (err, result) {
      if (err) {
        return console.log('err', err);
      }
      TimeTask.manualSync(866498, 9947721).then(function (savedLedgers) {
        savedLedgers.should.be.a.Array();
      })
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

describe('下载公链中所有账本计划', function () {
  it.only('7百万-八百万高度账本', function () {
    remote.connect(function (err, result) {
      if (err) {
        return console.log('err', err);
      }
      TimeTask.manualSync(7000000, 8000000).then(function (savedLedgers) {
        savedLedgers.should.be.a.Array();
      })
    })
  });
  it.only('八百万-九百万高度账本', function () {
    remote.connect(function (err, result) {
      if (err) {
        return console.log('err', err);
      }
      TimeTask.manualSync(8000000, 9000000).then(function (savedLedgers) {
        savedLedgers.should.be.a.Array();
      })
    })
  });
})

describe("测试并行下载", function () {
  it.only("7百万-8百万高度账本", function () {
    remote.connect(function (err, result) {
      if (err) {
        return console.log("err", err);
      }
      Promise.all([
        TimeTask.manualSync(6000000, 7000000),
        TimeTask.manualSync(7000000, 8000000)
      ]).then(function (savedLedgers) {
        savedLedgers.should.be.a.Array();
        console.log(savedLedgers);
      });
    });
  });
});
