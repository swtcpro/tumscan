let express = require('express');
let router = express.Router();
let indexRouter = {};
let env = process.env.NODE_ENV || 'development';
//接口访问
router.use('/api/v1', require('./api/v1/index').router);


console.log(env);
/* 服务端主页 */
router.get('/(|home|dashboard|account|transactions' +
    '|ledgers|transaction|ledger|chart|forum|tokens|ranking)', function (req, res) {
    if(_.trim(env) == 'production'){
        res.render('dist/index');
        return;
    }
    res.render('views/index');
});
// router.get('/', function (req, res) {
//   res.render('index');
// });

indexRouter.router = router;

module.exports = indexRouter;
