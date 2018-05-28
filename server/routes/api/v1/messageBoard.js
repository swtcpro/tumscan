/**
 \* Created with IntelliJ IDEA.
 \* User: 彭诗杰
 \* Date: 2018/4/17
 \* Time: 11:13
 \* Description: 井通相关路由
 * 采用 restful api 风格
 \*/
let express = require('express');
let router = express.Router();
let indexRouter = {};

// 获取留言
router.get('/messgae/:id', function(req, res) {});

// 增加留言
router.post('/message', function(req, res) {});

// 更新留言
router.post('/message/:id', function(req, res) {});

indexRouter.router = router;

module.exports = indexRouter;
