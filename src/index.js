const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const logger = require('koa-logger');
const range = require('./range');

const auth = require('./auth');
const config = require('./config');
const info = require('./info');
const dir = require('./dir');

const app = new Koa();
const insecured = new Router();

app.use(logger());
insecured.get('/', async (ctx, next) => {
  ctx.body = 'Hello World!';
  await next();
});
app.use(insecured.routes());

app.use(bodyParser());
app.use(auth);

const secured = new Router();
secured.use('/info', info.routes());
app.use(range);
secured.use('/dir', dir.routes());
app.use(secured.routes());

app.on('error', (err) => {
  if (err.code) {
    if (err.code === 'ECONNRESET') return;
    console.error(err.message);
  } else {
    console.error(err.message);
  }
});

app.listen(config.port, config.hostname);
