
const fs = require('fs');
const { PassThrough } = require('stream');
const { join } = require('path');
const { createHash } = require('crypto');


class CacheManager {
  /**
   *
   * @param {string} path Path to use as a cache directory.
   * @param {number} size Cache size in bytes. default: 1GB
   */
  constructor(path = './tmp', size = 1073741824) {
    this.MAX_SIZE = size;
    this.USED_SIZE = 0;
    this.path = path;
    this.db = [];

    if (fs.existsSync(path)) {
      this.db.push(
        ...fs.readdirSync(path).map((x) => {
          const stat = fs.statSync(join(path, x));
          return {
            key: x,
            size: stat.size,
            date: stat.mtime,
          };
        }),
      );
      this.db.sort((a, b) => b.date - a.date);
      this.USED_SIZE = this.db.reduce((p, c) => p + c.size, 0);
      this.freeCache();
    } else {
      fs.mkdirSync(path);
    }
  }

  /**
   * get filestream from cache if available
   * @param {string} key Key to get a filestream.
   */
  getCacheInfo(key) {
    const hkey = CacheManager.hash(key);
    const path = join(this.path, hkey);

    const found = this.db.find((x) => x.key === hkey);
    if (!found) return false;

    if (!fs.existsSync(path)) {
      this.db = this.db.filter((x) => x.key !== hkey);
      return false;
    }

    return {
      path, size: fs.statSync(path).size,
    };
  }

  /**
   * returns stream that saves on cache simultaneously
   * @param {ReadableStream} readstream
   * @param {Number} ContentLength
   * @param {string} key
   */
  cacheStream(readstream, ContentLength, key) {
    if (!this.freeCache(ContentLength)) {
      return readstream;
    }
    this.USED_SIZE += ContentLength;

    const hkey = CacheManager.hash(key);
    const path = join(this.path, hkey);
    const f = fs.createWriteStream(path, { encoding: 'binary' });
    const stream = new PassThrough();

    readstream.pipe(f);
    readstream.pipe(stream);

    readstream.on('error', () => {
      this.USED_SIZE -= ContentLength;
    });

    f.on('close', () => {
      this.db.push({
        key: hkey,
        size: ContentLength,
        date: new Date(),
      });
    });

    return stream;
  }

  freeCache(atLeastBytes = 0) {
    const goal = this.MAX_SIZE - atLeastBytes;
    if (goal < 0) return false;
    if (goal > this.USED_SIZE) return true;

    while (goal < this.USED_SIZE) {
      const f = this.db.pop();
      fs.unlinkSync(join(this.path, f.key));
      this.USED_SIZE -= f.size;
    }
    return true;
  }

  static hash(key) {
    const extention = key.slice((Math.max(0, key.lastIndexOf('.')) || Infinity) + 1);
    return `${createHash('sha1').update(key).digest('hex')}.${extention}`;
  }
}
module.exports = new CacheManager();
