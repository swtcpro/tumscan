let express = require('express');
let path = require('path');
let favicon = require('serve-favicon');
let logger = require('morgan');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');
let lessMiddleware = require('less-middleware');
let session = require('express-session');
// var cors = require('cors');
const cors = require('cors');
let index = require('./routes/index');

let app = express();

// view engine setup
app.set('views', __dirname);
app.set('view engine', 'html');
app.engine('.html', require('ejs').__express);
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser());
app.use(session({
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 24 * 60 * 60 * 1000
    }, //设置maxAge是1天，即1天后session和相应的cookie失效过期
    secret: 'love'
}));
app.use(lessMiddleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('dist'));


var env = process.env.NODE_ENV || 'development';

if (env === 'development') {
    //跨域问题处理
    app.use(cors({
        credentials: true,
        origin: 'http://localhost:8081'
    }));
    // app.all('*', function (req, res, next) {
    //     res.header('Access-Control-Allow-Origin', "http://tumscan.bbswtc.com:8081");
    //     res.header("Access-Control-Allow-Headers", "X-Requested-With");
    //     res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, PATCH,OPTIONS');
    //     //res.header('Access-Control-Allow-Headers', 'Content-Type');
    //     res.header("X-Powered-By", ' 3.2.1');
    //     res.header("Content-Type", "application/json;charset=utf-8");
    //     res.header('Access-Control-Allow-Credentials', 'true'); //告诉客户端可以在HTTP请求中带上Cookie
    //     next();
    // });
} else {
    app.use(cors({
        credentials: true,
        origin: 'http://106.14.65.102:8080'
    }));
}

app.use('/', index.router);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    // res.render('error');
});

module.exports = app;
