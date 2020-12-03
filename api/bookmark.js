const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const models = require('../models');
const { resultOk, resultError } = require('../misc/common');

router.post('/', async function(req, res) {
  const data = req.body;
  const [bookmark, created] = await models.Bookmark.findOrCreate({
    where: { name: data.name },
  });
  if (created) {
    res.json(resultOk(bookmark.toJSON(), 'Bookmark is added successfully'));
  } else {
    res.json(resultError(null, `Bookmark already exists with name "${data.name}"`));
  }
});

router.post('/:id', async function(req, res) {
  const data = req.body;
  const id = req.params.id;
  let bookmark = await models.Bookmark.findOne({ where: { id: id } });
  if (bookmark !== null) {
    const alreadyExistBookmark = await models.Bookmark.findOne({
      where: { [Op.and]: [{ name: data.name }, { id: { [Op.ne]: id } }] },
    });
    if (alreadyExistBookmark === null) {
      const [updated] = await models.Bookmark.update(data, {
        where: { id: id },
      });
      if (updated) {
        const updatedBookmark = await models.Bookmark.findOne({ where: { id: id } });
        res.json(resultOk(updatedBookmark.toJSON(), 'Bookmark is updated successfully'));
      }
    } else {
      res.json(resultError(null, `Bookmark already exists with name "${data.name}"`));
    }
  } else {
    res.json(resultError(null, `Bookmark does not exists with id "${id}"`));
  }
});

router.delete('/:id', async function(req, res) {
  const id = req.params.id;
  const deleted = await models.Bookmark.destroy({
    where: { id: id },
  });
  if (deleted) {
    res.json(resultOk(deleted, 'Bookmark is deleted successfully'));
  } else {
    res.json(resultError(`Bookmark not found with "${id}" id`));
  }
});

router.get('/', async function(req, res, next) {
  let bookmarks = null;
  try {
    bookmarks = await models.Bookmark.findAll({});
    return res.json(resultOk(bookmarks, 'List of bookmarks'));
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async function(req, res, next) {
  let bookmark = null;
  const id = req.params.id;
  try {
    bookmark = await models.Bookmark.findOne({ where: { id: id } });
    if (bookmark === null) {
      return res.json(resultError(`Bookmark not found with "${id}" id`));
    } else {
      return res.json(resultOk(bookmark, 'Founded bookmark'));
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
