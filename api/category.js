const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const models = require('../models');
const { resultOk, resultError } = require('../misc/common');
// const auth = require('../auth/auth');

router.post('/', async function(req, res) {
  const data = req.body;
  const [category, created] = await models.Category.findOrCreate({
    where: { name: data.name },
  });
  if (created) {
    res.json(resultOk(category.toJSON(), 'Category is added successfully'));
  } else {
    res.json(resultError(null, `Category already exists with name "${data.name}"`));
  }
});

router.post('/:id', async function(req, res) {
  const data = req.body;
  const id = req.params.id;
  let category = await models.Category.findOne({ where: { id: id } });
  if (category !== null) {
    const alreadyExistCategory = await models.Category.findOne({
      where: { [Op.and]: [{ name: data.name }, { id: { [Op.ne]: id } }] },
    });
    if (alreadyExistCategory === null) {
      const [updated] = await models.Category.update(data, {
        where: { id: id },
      });
      if (updated) {
        const updatedCategory = await models.Category.findOne({ where: { id: id } });
        res.json(resultOk(updatedCategory.toJSON(), 'Category is updated successfully'));
      }
    } else {
      res.json(resultError(null, `Category already exists with name "${data.name}"`));
    }
  } else {
    res.json(resultError(null, `Category does not exists with id "${id}"`));
  }
});

router.delete('/:id', async function(req, res) {
  const id = req.params.id;
  const deleted = await models.Category.destroy({
    where: { id: id },
  });
  if (deleted) {
    res.json(resultOk(deleted, 'Category is deleted successfully'));
  } else {
    res.json(resultError(`Category not found with "${id}" id`));
  }
});

router.get('/', async function(req, res, next) {
  let categories = null;
  try {
    categories = await models.Category.findAll({});
    return res.json(resultOk(categories, 'List of categories'));
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async function(req, res, next) {
  let category = null;
  const id = req.params.id;
  try {
    category = await models.Category.findOne({ where: { id: id } });
    if (category === null) {
      return res.json(resultError(`Category not found with "${id}" id`));
    } else {
      return res.json(resultOk(category, 'Founded category'));
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
