const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const models = require('../models');
const { resultOk, resultError } = require('../misc/common');

router.post('/', async function(req, res) {
  const data = req.body;
  const [message, created] = await models.Message.findOrCreate({
    where: { name: data.name },
  });
  if (created) {
    res.json(resultOk(message.toJSON(), 'Message is added successfully'));
  } else {
    res.json(resultError(null, `Message already exists with name "${data.name}"`));
  }
});

router.post('/:id', async function(req, res) {
  const data = req.body;
  const id = req.params.id;
  let message = await models.Message.findOne({ where: { id: id } });
  if (message !== null) {
    const alreadyExistMessage = await models.Message.findOne({
      where: { [Op.and]: [{ name: data.name }, { id: { [Op.ne]: id } }] },
    });
    if (alreadyExistMessage === null) {
      const [updated] = await models.Message.update(data, {
        where: { id: id },
      });
      if (updated) {
        const updatedMessage = await models.Message.findOne({ where: { id: id } });
        res.json(resultOk(updatedMessage.toJSON(), 'Message is updated successfully'));
      }
    } else {
      res.json(resultError(null, `Message already exists with name "${data.name}"`));
    }
  } else {
    res.json(resultError(null, `Message does not exists with id "${id}"`));
  }
});

router.delete('/:id', async function(req, res) {
  const id = req.params.id;
  const deleted = await models.Message.destroy({
    where: { id: id },
  });
  if (deleted) {
    res.json(resultOk(deleted, 'Message is deleted successfully'));
  } else {
    res.json(resultError(`Message not found with "${id}" id`));
  }
});

router.get('/', async function(req, res, next) {
  let messages = null;
  try {
    messages = await models.Message.findAll({});
    return res.json(resultOk(messages, 'List of messages'));
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async function(req, res, next) {
  let message = null;
  const id = req.params.id;
  try {
    message = await models.Message.findOne({ where: { id: id } });
    if (message === null) {
      return res.json(resultError(`Message not found with "${id}" id`));
    } else {
      return res.json(resultOk(message, 'Founded message'));
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
