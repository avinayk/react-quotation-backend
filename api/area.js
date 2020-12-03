const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const models = require('../models');
const { resultOk, resultError } = require('../misc/common');

router.post('/', async function(req, res) {
  const data = req.body;
  const [area, created] = await models.Area.findOrCreate({
    where: { name: data.name },
  });
  if (created) {
    res.json(resultOk(area.toJSON(), 'Area is added successfully'));
  } else {
    res.json(resultError(null, `Area already exists with name "${data.name}"`));
  }
});

router.post('/:id', async function(req, res) {
  const data = req.body;
  const id = req.params.id;
  let area = await models.Area.findOne({ where: { id: id } });
  if (area !== null) {
    const alreadyExistArea = await models.Area.findOne({
      where: { [Op.and]: [{ name: data.name }, { id: { [Op.ne]: id } }] },
    });
    if (alreadyExistArea === null) {
      const [updated] = await models.Area.update(data, {
        where: { id: id },
      });
      if (updated) {
        const updatedArea = await models.Area.findOne({ where: { id: id } });
        res.json(resultOk(updatedArea.toJSON(), 'Area is updated successfully'));
      }
    } else {
      res.json(resultError(null, `Area already exists with name "${data.name}"`));
    }
  } else {
    res.json(resultError(null, `Area does not exists with id "${id}"`));
  }
});

router.delete('/:id', async function(req, res) {
  const id = req.params.id;
  const deleted = await models.Area.destroy({
    where: { id: id },
  });
  if (deleted) {
    res.json(resultOk(deleted, 'Area is deleted successfully'));
  } else {
    res.json(resultError(`Area not found with "${id}" id`));
  }
});

router.get('/', async function(req, res, next) {
  let areas = null;
  try {
    areas = await models.Area.findAll({});
    return res.json(resultOk(areas, 'List of areas'));
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async function(req, res, next) {
  let area = null;
  const id = req.params.id;
  try {
    area = await models.Area.findOne({ where: { id: id } });
    if (area === null) {
      return res.json(resultError(`Area not found with "${id}" id`));
    } else {
      return res.json(resultOk(area, 'Founded area'));
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
