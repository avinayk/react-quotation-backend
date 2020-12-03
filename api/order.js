const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const models = require('../models');
const { resultOk, resultError } = require('../misc/common');

router.post('/', async function(req, res) {
  const data = req.body;
  const [order, created] = await models.Order.findOrCreate({
    where: { name: data.name },
  });
  if (created) {
    res.json(resultOk(order.toJSON(), 'Order is added successfully'));
  } else {
    res.json(resultError(null, `Order already exists with name "${data.name}"`));
  }
});

router.post('/:id', async function(req, res) {
  const data = req.body;
  const id = req.params.id;
  let order = await models.Order.findOne({ where: { id: id } });
  if (order !== null) {
    const alreadyExistOrder = await models.Order.findOne({
      where: { [Op.and]: [{ name: data.name }, { id: { [Op.ne]: id } }] },
    });
    if (alreadyExistOrder === null) {
      const [updated] = await models.Order.update(data, {
        where: { id: id },
      });
      if (updated) {
        const updatedOrder = await models.Order.findOne({ where: { id: id } });
        res.json(resultOk(updatedOrder.toJSON(), 'Order is updated successfully'));
      }
    } else {
      res.json(resultError(null, `Order already exists with name "${data.name}"`));
    }
  } else {
    res.json(resultError(null, `Order does not exists with id "${id}"`));
  }
});

router.delete('/:id', async function(req, res) {
  const id = req.params.id;
  const deleted = await models.Order.destroy({
    where: { id: id },
  });
  if (deleted) {
    res.json(resultOk(deleted, 'Order is deleted successfully'));
  } else {
    res.json(resultError(`Order not found with "${id}" id`));
  }
});

router.get('/', async function(req, res, next) {
  let orders = null;
  try {
    orders = await models.Order.findAll({});
    return res.json(resultOk(orders, 'List of orders'));
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async function(req, res, next) {
  let order = null;
  const id = req.params.id;
  try {
    order = await models.Order.findOne({ where: { id: id } });
    if (order === null) {
      return res.json(resultError(`Order not found with "${id}" id`));
    } else {
      return res.json(resultOk(order, 'Founded order'));
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
