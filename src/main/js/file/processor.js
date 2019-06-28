const path = require('path'), 
  fs = require('fs'),
  EventEmitter = require('events'), 
  mmm = require('mmmagic'),
  Magic = mmm.Magic,
  md5 = require('md5-file'),
  logger = require('../logger');

class Processor extends EventEmitter {

  magic = new Magic(mmm.MAGIC_MIME_TYPE);

  retrieveMimeType(filePath) {
    return new Promise((resolve, reject) => {
      magic.detectFile(filePath, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      })
    });
  }

  retrieveMD5(filePath) {
    return new Promise((resolve, reject) => {
      md5(filePath, (err, hash) => {
        if (err) {
          reject(err);
        } else {
          resolve(hash);
        }
      });
    });
  }

  retrieveFileSize(filePath) {
    return new Promise((resolve, reject) => {
      fs.stat(filePath, (err, { size }) => {
        if (err) {
          reject(err);
        } else {
          resolve(size / 1e3);
        }
      });
    });
  }

  async process(filePath) {
    try {
      const [mimeType, hash, sizeInKb] = await Promise.all([
        this.retrieveMimeType(filePath),
        this.retrieveMD5(filePath),
        this.retrieveFileSize(filePath)
      ]);

      this.emit('processed', {
        path: filePath,
        name: path.basename(filePath),
        md5: hash,
        sizeInKb,
        mimeType
      });

    } catch (e) {
      Processor.LOG.error(`An error occured while processing filePath ${filePath}`, e);
    }
  }

}
Processor.LOG = logger('Processor');

