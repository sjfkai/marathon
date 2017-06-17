'use strict';
const Koa = require('koa');
const Router = require('koa-router');
const cors = require('kcors');

const app = new Koa();
const router = new Router();

require('./src/routes')(router);

app.use(cors());
app.use(require('koa-logger')());
app.use(require('koa-bodyparser')());

app.use(router.routes());
app.use(router.allowedMethods());

app.listen(3000);
console.log('server start at port 3000');
