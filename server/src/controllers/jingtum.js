/**
 \* Created with IntelliJ IDEA.
 \* User: 彭诗杰
 \* Date: 2018/4/17
 \* Time: 11:13
 \* Description: 井通controller层相关接口
 \*/
import API from '../api/api_jingtum';
import jingtumService from '../service/jingtum_service'

let tumController = {};

/**
 * 验证钱包地址或交易hash是否合法
 * @param req
 * @param res
 */
tumController.verifyWalletAndHash = function (req, res) {
    let variable = _.trim(req.params.variable || '');
    API.verifyWalletAndHash(variable).then(function (result) {
        console.log(result);
        return res.json(result);
    }, function (error) {
        console.log(error);
        return res.json(error);
    });
};

/**
 * 初始化渲染主页所需的数据
 * @param req
 * @param res
 */
tumController.homeInit = function (req, res) {
    API.init().then(function (result) {
        console.log(result);
        return res.json(result);
    }, function (error) {
        console.log(error);
        res.status(500);
        return res.json({"success": false, "msg": error});
    });
};

/**
 * 查询和钱包相关的信息（包括余额和交易）
 * @param req
 * @param res
 */
tumController.queryWallet = function (req, res) {
    let address = _.trim(req.params.address || '');
    API.queryWallent(address).then(function (result) {
        console.log(result);
        return res.json(result);
    }, function (error) {
        console.log(error);
        res.status(500);
        return res.json({"success": false, "msg": error});
    });
};

/**
 * 查询单个交易的信息
 * @param req
 * @param res
 */
tumController.queryTx = function (req, res) {
    let hash = _.trim(req.params.hash || '');
    API.queryTx(hash).then(function (result) {
        console.log(result);
        return res.json(result);
    }, function (error) {
        console.log(error);
        res.status(500);
        return res.json({"success": false, "msg": error});
    });
};

/**
 * 通过Lib库查询单个交易的信息
 * @param req
 * @param res
 */
tumController.queryTxLib = function (req, res) {
    let hash = _.trim(req.params.hash || '');
    jingtumService.queryTx(hash).then(result => {
        console.log(result);
        return res.json(result);
    }, error => {
        console.log(error);
        res.status(500);
        return res.json({"success": false, "msg": error});
    });
};

/**
 * 查询井通代币信息
 * @param req
 * @param res
 */
tumController.queryTokens = function (req, res) {

};

/**
 * 查询单个账本信息
 * @param req
 * @param res
 */
tumController.queryLedger = function (req, res) {
    let hash = _.trim(req.params.hash || '');
    if (typeof hash == 'undefined' || hash === 'undefined') {
        res.status(500);
        return res.json({"success": false, "msg": "hash参数不合法"});
    } else {
        jingtumService.queryLedger(hash).then(ledger => {
            console.log('tumController', ledger);
            res.json(ledger);
        })
    }
};


tumController.queryBalancesByAddress = function (req, res, callback) {
    jingtumService.queryBalance(req, res, callback)
    // let address = _.trim(req.params.address || '');
    // remote.connect(function (err, result) {
    //     if (err) {
    //         console.log("error:" + err);
    //         remote.disconnect();
    //         return res.json(err);
    //     }
    //     let options = {account: address};
    //     remote.requestAccountInfo(options).submit(function (err, result) {
    //         if (err) {
    //             console.log("error:" + err);
    //             remote.disconnect();
    //             return res.json(err);
    //         } else if (result) {
    //             console.log(result);
    //             remote.disconnect();
    //             return res.json(result);
    //         }
    //     });
    // });
};

tumController.findTransactionsByAddress = function (req, res) {
    let address = _.trim(req.params.address || '');
    remote.connect(function (err, result) {
        if (err) {
            console.log("error:" + err);
            remote.disconnect();
            return res.json(err);
        }
        let options = {account: address};
        remote.requestAccountTx(options).submit(function (err, result) {
            if (err) {
                console.log("error:" + err);
                return res.json(err);
            } else if (result) {
                console.log(result);
                remote.disconnect();
                return res.json(result);
            }
        });
    })
};

module.exports = tumController;
