const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const models = require('../models');
const { resultOk, resultError } = require('../misc/common');

router.post('/', async function(req, res) {
  const data = req.body;
  const [rating, created] = await models.Rating.findOrCreate({
    where: { name: data.name },
  });
  if (created) {
    res.json(resultOk(rating.toJSON(), 'Rating is added successfully'));
  } else {
    res.json(resultError(null, `Rating already exists with name "${data.name}"`));
  }
});

router.post('/:id', async function(req, res) {
  const data = req.body;
  const id = req.params.id;
  let rating = await models.Rating.findOne({ where: { id: id } });
  if (rating !== null) {
    const alreadyExistRating = await models.Rating.findOne({
      where: { [Op.and]: [{ name: data.name }, { id: { [Op.ne]: id } }] },
    });
    if (alreadyExistRating === null) {
      const [updated] = await models.Rating.update(data, {
        where: { id: id },
      });
      if (updated) {
        const updatedRating = await models.Rating.findOne({ where: { id: id } });
        res.json(resultOk(updatedRating.toJSON(), 'Rating is updated successfully'));
      }
    } else {
      res.json(resultError(null, `Rating already exists with name "${data.name}"`));
    }
  } else {
    res.json(resultError(null, `Rating does not exists with id "${id}"`));
  }
});

router.delete('/:id', async function(req, res) {
  const id = req.params.id;
  const deleted = await models.Rating.destroy({
    where: { id: id },
  });
  if (deleted) {
    res.json(resultOk(deleted, 'Rating is deleted successfully'));
  } else {
    res.json(resultError(`Rating not found with "${id}" id`));
  }
});

router.get('/', async function(req, res, next) {
  let ratings = null;
  try {
    ratings = await models.Rating.findAll({});
    return res.json(resultOk(ratings, 'List of ratings'));
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async function(req, res, next) {
  let rating = null;
  const id = req.params.id;
  try {
    rating = await models.Rating.findOne({ where: { id: id } });
    if (rating === null) {
      return res.json(resultError(`Rating not found with "${id}" id`));
    } else {
      return res.json(resultOk(rating, 'Founded rating'));
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
