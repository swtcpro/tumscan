/**
 * Created by wudan on 2017/7/25.
 */
const config = require('./config');
const logger = require('./logger');
const utils = require('./utils');
const Remote = require('jingtum-lib').Remote;
const remote = new Remote(config.get('skywelld_servers'));


remote.connect(function (err, data) {
    if (err) {
        logger.error('fail connect jingtum' + err);
    } else {
        logger.info('connect to jingtum');

        remote.on('disconnect', function () {
            logger.error('disconnect to jingtum');
        });

        remote.on('reconnect', function () {
            logger.error('reconnect to jingtum');
        });

        /**
         * 注销掉实时获取区块链中的数据
         */
        // remote.on('transactions', function (tx) {
        //     // logger.info('remote get transactions:',tx);
        //     tumUtils.processTx(tx).then(function (result) {
        //         logger.info('processTx完成!')
        //     }).catch(function (error) {
        //         logger.info(error)
        //     })
        // });
    }
});


module.exports = remote;

