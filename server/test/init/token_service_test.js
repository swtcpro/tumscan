/**
 \* Created with IntelliJ IDEA.
 \* @author: 彭诗杰
 \* @time: 2019/11/12 17:49
 \* Description: 代币模块init功能
 \*/
import 'babel-polyfill';
import tokenService from '../../src/service/token_service';
const logger = require('../../src/lib/logger');
const remote = require('../../src/lib/remote');

describe('tokenService', function () {
    it.only('tokenInit函数测试_初始化代币功能', function (done) {
        this.timeout(0);
        remote.connect((err, result) => {
            if (err) {
                return logger.info(err);
            }
            tokenService.tokenInit().then(result => {
                logger.info(result);
                done();
            }).catch(error => {
                logger.error(error);
                done();
            })
        });
    });


});