const S3 = require('aws-sdk/clients/s3');
const Router = require('koa-router');
const config = require('../config');

const router = new Router();

router.get('/', async (ctx, next) => {
  const s3 = new S3(config.s3);
  try {
    const data = (await s3.listBuckets().promise()).Buckets;
    ctx.body = {
      num: {
        dir: 0,
        obj: 0,
        bucket: data.length,
      },
      bucket: data,
      dir: [],
      obj: [],
    };
  } catch (e) {
    ctx.body = e.message;
    ctx.status = 500;
  }
  await next();
});
router.get(['/:bucket', '/:bucket/*'], async (ctx, next) => {
  const s3 = new S3(config.s3);
  const { bucket } = ctx.params;
  const key = decodeURI(ctx.request.path).slice(`/info/${bucket}/`.length);
  console.log(key);

  const { token } = ctx.request.query;
  try {
    const data = (await s3.listObjectsV2({
      Bucket: bucket,
      Delimiter: '/',
      ContinuationToken: token,
      Prefix: key,
    }).promise());

    ctx.body = {
      num: {
        dir: data.CommonPrefixes.length,
        obj: data.Contents.length,
        bucket: 0,
      },
      bucket: [],
      dir: data.CommonPrefixes.map((x) => x.Prefix.slice(0, -1)),
      obj: data.Contents,
      token: data.NextContinuationToken,
    };
  } catch (e) {
    ctx.body = e.message;
    ctx.status = 500;
  }
  await next();
});
module.exports = router;
