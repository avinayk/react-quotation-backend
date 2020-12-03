/* eslint-disable require-atomic-updates */
const express = require('express');
const router = express.Router();
const fs = require('fs');
const { resultOk, resultError, checkDirectory } = require('../misc/common');
const formidable = require('formidable');
const models = require('../models');
const sharp = require('sharp');

router.post('/:imageName', async function(req, res, next) {
  let currentDir = __dirname.split('/');
  currentDir.splice(currentDir.length - 1, 1);
  currentDir = currentDir.join('/');
  const imagePath = `/public/assets/media/`;
  const form = new formidable.IncomingForm();
  form.parse(req, async function(err, fields, files) {
    const file = files.file;
    let imageName = file.name;
    const tempImageName = imageName.split('.');
    try {
      let dir = checkDirectory(currentDir, imagePath);
      const typeArr = file.type.split('/');
      if (dir) {
        const medias = await models.Media.findAll({});
        const mediaNames = medias.map(media => {
          return media.name;
        });
        if (mediaNames.includes(imageName)) {
          let i = 0;
          do {
            imageName = `${tempImageName[0]}_copy(${i++}).${tempImageName[1]}`;
          } while (mediaNames.includes(imageName));
        }

        const readableStream = fs.createReadStream(file.path);
        dir = `${dir}${imageName}`;
        const writeStream = fs.createWriteStream(dir);

        readableStream.pipe(writeStream).on('finish', function() {
          const obj = {
            name: imageName,
            type: fields.type || 'POST',
            mediaType: typeArr[0],
            mediaUrl: writeStream.path,
            path: dir,
          };
          models.Media.create(obj)
            .then(media => {
              res.json(resultOk(media.toJSON(), 'Media is uploaded successfully'));
            })
            .catch(err => {
              next(err);
            });
        });
      }
    } catch (err) {
      next(err);
    }
  });
});

router.post('/rename/:id', async function(req, res, next) {
  const id = req.params.id;
  const data = req.body;
  let newName = data.name;
  const tempImageName = newName.split('.');
  let currentDir = __dirname.split('/');
  currentDir.splice(currentDir.length - 1, 1);
  currentDir = currentDir.join('/');
  const imagePath = `/public/assets/media/`;
  let dir = checkDirectory(currentDir, imagePath);
  dir = `${dir}${newName}`;
  const alreadyExistsMedia = await models.Media.findOne({ where: { id: id } });
  if (alreadyExistsMedia) {
    const medias = await models.Media.findAll({});
    const mediaNames = medias.map(media => {
      return media.name;
    });
    if (mediaNames.includes(newName)) {
      let i = 0;
      do {
        newName = `${tempImageName[0]}_copy(${i++}).${tempImageName[1]}`;
      } while (mediaNames.includes(newName));
    }
    const obj = {
      ...data,
      path: dir,
      mediaUrl: dir,
    };
    fs.rename(alreadyExistsMedia.mediaUrl, obj.mediaUrl, err => {
      if (err) {
        next(err);
      } else {
        models.Media.update(obj, { where: { id: id } })
          .then(async updated => {
            if (updated) {
              const updatedMedia = await models.Media.findOne({
                where: { id: id },
              });
              res.json(resultOk(updatedMedia, 'media name updated successfully'));
            }
          })
          .catch(err => {
            next(err);
          });
      }
    });
  }
});

router.delete('/:name', async function(req, res, next) {
  let name = req.params.name;
  const alreadyExistsMedia = await models.Media.findOne({ where: { name: name } });
  if (alreadyExistsMedia) {
    const mediaInPost = await models.Post.findAll({ where: { mediaUrl: name } });
    const mediaInStep = await models.PostStep.findAll({ where: { mediaUrl: name } });
    if (
      (mediaInPost.length && mediaInPost.length > 0) ||
      (mediaInStep.length && mediaInStep.length > 0)
    ) {
      res.json(resultError('Media cannot be deleted'));
    } else {
      fs.unlink(alreadyExistsMedia.mediaUrl, err => {
        if (err) {
          next(err);
        } else {
          models.Media.destroy({ where: { name: name } })
            .then(() => {
              res.json(resultOk(alreadyExistsMedia, 'record deleted successfully'));
            })
            .catch(err => {
              next(err);
            });
        }
      });
    }
  } else {
    res.json(resultError('No media founded with the name'));
  }
});

router.get('/getAll', async function(req, res, next) {
  let medias = null;
  try {
    medias = await models.Media.findAll({});
    return res.json(resultOk(medias, 'List of medias'));
  } catch (error) {
    next(error);
  }
});

router.get('/:fileName', async function(req, res, next) {
  const fileName = req.params.fileName;
  const tempImageName = fileName.split('.');
  const width = parseInt(req.query.width) || null;
  const height = parseInt(req.query.height) || null;
  let currentDir = __dirname.split('/');
  currentDir.splice(currentDir.length - 1, 1);
  currentDir = currentDir.join('/');
  const resizedImagePath = `/public/assets/resized/`;
  const originalImagePath = `/public/assets/media/`;
  const tempFileName = `${tempImageName[0]}-${width}x${height}.${tempImageName[1]}`;
  let originalFileDir = checkDirectory(currentDir, originalImagePath);
  originalFileDir = `${originalFileDir}${fileName}`;
  let resizedFileDir = checkDirectory(currentDir, resizedImagePath);
  resizedFileDir = `${resizedFileDir}${tempFileName}`;
  try {
    const media = await models.Media.findOne({ where: { name: fileName } });
    if (media !== null) {
      if (!width && !height) {
        fs.exists(originalFileDir, exists => {
          if (exists) {
            res.sendFile(originalFileDir);
          }
        });
      } else {
        fs.exists(resizedFileDir, exists => {
          if (exists) {
            res.sendFile(resizedFileDir);
          } else {
            const readableStream = fs.createReadStream(originalFileDir);
            let transform = sharp();
            if (width || height) {
              transform = transform.resize(width, height);
            }
            const writeStream = fs.createWriteStream(resizedFileDir);
            readableStream
              .pipe(transform)
              .pipe(writeStream)
              .on('finish', function() {
                return res.sendFile(writeStream.path);
              });
          }
        });
      }
    } else {
      return res.json(resultError('Invalid filename'));
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
