let express = require('express');
let router = express.Router();
let indexRouter = {};

//接口访问
router.use('/api/v1', require('./api/v1/index').router);

/* 服务端主页 */
router.get('/(|home|dashboard|account|transactions' +
    '|ledgers|transaction|ledger|chart|forum|tokens)', function (req, res) {
    res.render('index');
});
// router.get('/', function (req, res) {
//   res.render('index');
// });

indexRouter.router = router;

module.exports = indexRouter;
