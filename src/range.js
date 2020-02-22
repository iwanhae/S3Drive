const util = require('util');

function rangeParse(str) {
  const token = str.split('=');
  if (!token || token.length !== 2 || token[0] !== 'bytes') {
    return null;
  }
  return token[1].split(',')
    .map((range) => range.split('-').map((value) => {
      if (value === '') {
        return Infinity;
      }
      return Number(value);
    }))
    .filter((range) => !Number.isNaN(range[0]) && !Number.isNaN(range[1]) && range[0] <= range[1]);
}

function rangeContentGenerator(start, end, length) {
  return util.format('bytes %d-%d/%s', start, end, length);
}

module.exports = async (ctx, next) => {
  const { range } = ctx.header;
  ctx.set('Accept-Ranges', 'bytes');

  if (!range) {
    await next();
  } else {
    const ranges = rangeParse(range);

    if (!ranges || ranges.length === 0) {
      ctx.status = 416;
    } else if (ctx.method === 'PUT') {
      ctx.status = 400;
    } else {
      const firstRange = ranges[0];

      ctx.range = {
        start: firstRange[0],
        end: firstRange[1],
        ObjectLength: 0,
        query: ctx.header.range,
      };

      await next();

      if (ctx.status === 200) {
        ctx.set('Content-Range', rangeContentGenerator(ctx.range.start, ctx.range.end, ctx.range.ObjectLength));
        ctx.set('Content-Length', ctx.range.end - ctx.range.start + 1);
        ctx.status = 206;
      }
    }
  }
};
