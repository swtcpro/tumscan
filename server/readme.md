后端提供接口。

# 改动

## es2015 语法环境下开发配置（代码文件监听重启服务）\

```
增加
"dev": "nodemon ./bin/www --exec babel-node --presets es2015,stage-2"

增加全局的nodemon
npm install nodemon -g

npm run dev
```

## routes/index.ejs

```
    增加路由匹配，将前端页面路由和后端路由对应
    /* 服务端主页 */
    router.get('/(|home|dashboard|account|transactions|ledgers|transaction|chart|forum)', function (req, res) {
    res.render('index');
    });
    // router.get('/', function (req, res) {
    //   res.render('index');
    // });
```

## views/index.ejx

```
    将模板js引向前端工程环境
    <script src='//localhost:3000/assets/app.js'></script>
```

## 测试框架 mocha 使用

windows 需要全局安装
npm install -g mocha
