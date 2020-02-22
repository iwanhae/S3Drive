const jwt = require('jsonwebtoken');
const config = require('./config');

/**
 * Manage JWT
 * @constructor iwanhae
 * @param {import("koa").Context} ctx
 * @param {import("koa").Next} next
 */
module.exports = async (ctx, next) => {
  if (ctx.status !== 404) return;

  if (ctx.request.path === '/auth' && ctx.request.method === 'POST') {
    const { body } = ctx.request;
    if (body.id === config.id && body.pw === config.pw) {
      ctx.cookies.set('token', jwt.sign({ id: body.id }, config.jwtSecret, {
        expiresIn: '7 days',
      }));
      ctx.body = {
        id: config.id,
      };
    } else if (body.id === '' && body.pw === '') {
      const token = ctx.cookies.get('token');
      try {
        const { id } = jwt.verify(token, config.jwtSecret);
        ctx.cookies.set('token', jwt.sign({ id }, config.jwtSecret, {
          expiresIn: '7 days',
        }));
        ctx.body = {
          id: config.id,
        };
      } catch (e) {
        ctx.body = `:( ${e.message}`;
        ctx.status = 401;
      }
    } else {
      ctx.body = ':(';
      ctx.status = 401;
    }
  } else {
    try {
      const token = ctx.cookies.get('token');
      ctx.user = jwt.verify(token, config.jwtSecret);
      await next();
    } catch (e) {
      ctx.body = `:( ${e.message}`;
      ctx.status = 401;
    }
  }
};
