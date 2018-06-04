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
router.get('/message/:id', function (req, res) {
    let id = _.trim(req.params.id || '');
    message_servie.getMessage(id).then((result) => {
        console.log(result);
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
        console.log(result);
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
router.post('/message/:id', function (req, res) {
});

indexRouter.router = router;

module.exports = indexRouter;
