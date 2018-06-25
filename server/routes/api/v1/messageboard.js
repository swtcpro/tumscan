/**
 \* User: zfn
 \* Date: 2018/5/30
 \* Description: 留言板相关路由
 * 采用 restful api 风格
 **/
let express = require('express');
let router = express.Router();
let indexRouter = {};
import messageService from '../../../src/service/message_service';
const utils = require('../../../src/lib/utils');

const message_servie = new messageService()
// 获取留言
router.get('/message/:id(\\d+)', function (req, res) {
    let id = _.trim(req.params.id || '');
    message_servie.getMessage(id).then((result) => {
        return res.json(result);
    }).catch((error) => {
        return res.json({
            'success': false,
            'msg': error,
        });
    });
});

// 新增留言
router.post('/message', function (req, res) {
    const title = req.body.title;
    const message = req.body.message;
    const ip = utils.getClientIp(req);
    message_servie.addMessage(title, message, ip).then((result) => {
        return res.json({
            'success': true,
        });
    }).catch((error) => {
        res.json({
            'success': false,
            'msg': error,
        });
    });
});

// 更新留言
router.post('/message/:id', function (req, res) {});

//分页获取数据
router.get('/message', function (req, res) {
    let page = parseInt(_.trim(req.query.page || 1));
    let limit = parseInt(_.trim(req.query.limit || 10));
    message_servie.getMessagePaging(page, limit).then((result) => {
        return res.json(result);
    }).catch((error) => {
        return res.json({
            'success': false,
            'msg': error,
        });
    });
});

//分页按照时间获取数据
router.get('/messagetime', function (req, res) {
    let page = parseInt(_.trim(req.query.page || 1));
    let limit = parseInt(_.trim(req.query.limit || 10));
    let startTime = parseInt(_.trim(req.query.startTime)) || new Date();
    let endTime =  parseInt(_.trim(req.query.endTime)) || new Date();
    message_servie.getMessageByTime(page, limit, startTime, endTime).then((result) => {
        return res.json(result);
    }).catch((error) => {
        return res.json({
            'success': false,
            'msg': error,
        });
    });
});

//分页按照时间获取数据
router.get('/message/title', function (req, res) {
    let page = parseInt(_.trim(req.query.page || 1));
    let limit = parseInt(_.trim(req.query.limit || 10));
    let title = _.trim(req.query.title) || '';
    message_servie.getMessageByTitle(page, limit, title).then((result) => {
        return res.json(result);
    }).catch((error) => {
        return res.json({
            'success': false,
            'msg': error,
        });
    });
});

indexRouter.router = router;

module.exports = indexRouter;
