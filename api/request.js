const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const models = require('../models');
const auth = require('../auth/auth');
const { resultOk, resultError } = require('../misc/common');

router.post('/',auth, async function(req, res) {
  const data = req.body;
  const [rating, created] = await models.Request.findOrCreate({
    where: { name: data.name },
  });
  if (created) {
    res.json(resultOk(rating.toJSON(), 'Request is added successfully'));
  } else {
    res.json(resultError(null, `Request already exists with name "${data.name}"`));
  }
});

router.post('/:id',auth, async function(req, res) {
  const data = req.body;
  const id = req.params.id;
  let rating = await models.Request.findOne({ where: { id: id } });
  if (rating !== null) {
    const alreadyExistRating = await models.Request.findOne({
      where: { [Op.and]: [{ name: data.name }, { id: { [Op.ne]: id } }] },
    });
    if (alreadyExistRating === null) {
      const [updated] = await models.Request.update(data, {
        where: { id: id },
      });
      if (updated) {
        const updatedRating = await models.Request.findOne({ where: { id: id } });
        res.json(resultOk(updatedRating.toJSON(), 'Request is updated successfully'));
      }
    } else {
      res.json(resultError(null, `Request already exists with name "${data.name}"`));
    }
  } else {
    res.json(resultError(null, `Request does not exists with id "${id}"`));
  }
});

router.delete('/:id',auth, async function(req, res) {
  const id = req.params.id;
  const deleted = await models.Request.destroy({
    where: { id: id },
  });
  if (deleted) {
    res.json(resultOk(deleted, 'Request is deleted successfully'));
  } else {
    res.json(resultError(`Request not found with "${id}" id`));
  }
});

router.get('/',auth, async function(req, res, next) {
  let requests = null;
  try {
    requests = await models.Request.findAll({
  limit : 10,
  offset : 1,
    });
    return res.json(resultOk(requests, 'List of requests'));
  } catch (error) {
    next(error);
  }
});

router.get('/:id',auth, async function(req, res, next) {
  let rating = null;
  const id = req.params.id;
  try {
    rating = await models.Request.findOne({ where: { id: id } });
    if (rating === null) {
      return res.json(resultError(`Request not found with "${id}" id`));
    } else {
      return res.json(resultOk(rating, 'Founded rating'));
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
