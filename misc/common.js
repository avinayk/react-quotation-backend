const moment = require('moment');
const fs = require('fs');

const resultOk = function(data, msg) {
  return { status: 'ok', data, msg };
};

const resultError = function(data, msg) {
  return { status: 'error', data, msg };
};

const lastModified = function(schema, options) {
  schema.pre('save', function(next) {
    this.modifiedAt = moment()
      .utc()
      .unix();
    next();
  });
  if (options) {
    schema.path('modifiedAt');
  }
};

const checkDirectory = function(currentDir, postDir) {
  let tempDirArr = postDir.split('/');
  let tempCurrentDir = currentDir;
  tempDirArr.forEach(el => {
    if (!fs.existsSync(`${tempCurrentDir}/${el}`)) {
      tempCurrentDir = `${tempCurrentDir}/${el}`;
      fs.mkdirSync(tempCurrentDir, { recursive: true, mode: 777 });
      fs.chmodSync(tempCurrentDir, 777);
    } else {
      tempCurrentDir = `${tempCurrentDir}${el}/`;
    }
  });
  return tempCurrentDir;
};

module.exports = { resultError, resultOk, lastModified, checkDirectory };
