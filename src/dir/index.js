const S3 = require('aws-sdk/clients/s3');
const Router = require('koa-router');
const fs = require('fs');
const mime = require('mime-types');
const config = require('../config');
const cache = require('../cache');

const router = new Router();

router.get('/', async (ctx, next) => {
  const s3 = new S3(config.s3);
  try {
    ctx.body = (await s3.listBuckets().promise()).Buckets;
  } catch (e) {
    ctx.body = e.message;
    ctx.status = 500;
  }
  await next();
});

router.get(['/:bucket', '/:bucket/*'], async (ctx, next) => {
  const s3 = new S3(config.s3);
  const { bucket } = ctx.params;
  const key = decodeURI(ctx.request.path).slice(`/dir/${bucket}/`.length);

  if (!key) {
    ctx.status = 400;
    ctx.body = ':(';
  } else {
    let info = cache.getCacheInfo(key);
    if (info) {
      console.log('CACHE');
      if (ctx.range) {
        ctx.range.ObjectLength = info.size;
        if (ctx.range.end === Infinity) ctx.range.end = info.size - 1;
        ctx.body = fs.createReadStream(info.path, { start: ctx.range.start, end: ctx.range.end });
      } else {
        ctx.set('Content-Length', info.size);
        ctx.body = fs.createReadStream(info.path);
      }
      ctx.type = mime.lookup(key);
    } else {
      console.log('S3');
      try {
        info = await s3.headObject({ Bucket: bucket, Key: key }).promise();

        let stream;
        if (ctx.range) {
          ctx.range.ObjectLength = info.ContentLength;
          if (ctx.range.end === Infinity) ctx.range.end = info.ContentLength - 1;
          stream = s3.getObject({ Bucket: bucket, Key: key, Range: ctx.range.query })
            .createReadStream();
          ctx.body = stream;
        } else {
          ctx.set('Content-Length', info.ContentLength);
          stream = s3.getObject({ Bucket: bucket, Key: key }).createReadStream();
          ctx.body = cache.cacheStream(stream, info.ContentLength, key);
        }

        ctx.type = mime.lookup(key);
      } catch (e) {
        ctx.body = e.message;
        ctx.status = 404;
      }
    }
  }
  await next();
});

module.exports = router;
