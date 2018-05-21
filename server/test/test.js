/**
 \* Created with IntelliJ IDEA.
 \* User: 彭诗杰
 \* Date: 2018/5/15
 \* Time: 15:05
 \* Description:
 \*/
let jingtumService = require('../src/service/jingtum_service');
let assert = require('assert');

describe('#jingtumLib()', function () {
    describe('ledger tests', function () {
        it.only('query single ledger test', function () {
            let result = {};

            result = jingtumService.queryLedger("F589E0BC80AFA14216E2D94837E27E96A5A94C771918867291DB4E22E685975D");

            console.log(result);
            // assert(!!result);


        });
    });

    describe('transaction tests', function () {
        it('query single transaction test', function () {
            let result = {};
            new Promise(function () {
                result = jingtumService.queryTx('68E502101C2E0644BC0BFE59665F533706A7FD8CABF579448EDEC526C66C9244');
            }).then(function () {
                console.log(result);
                assert(result)
            });
        })
    });
});