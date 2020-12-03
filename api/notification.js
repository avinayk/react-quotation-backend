const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const models = require('../models');
const { resultOk, resultError } = require('../misc/common');

router.post('/', async function(req, res) {
  const data = req.body;
  const [notification, created] = await models.Notification.findOrCreate({
    where: { name: data.name },
  });
  if (created) {
    res.json(resultOk(notification.toJSON(), 'Notification is added successfully'));
  } else {
    res.json(resultError(null, `Notification already exists with name "${data.name}"`));
  }
});

router.post('/:id', async function(req, res) {
  const data = req.body;
  const id = req.params.id;
  let notification = await models.Notification.findOne({ where: { id: id } });
  if (notification !== null) {
    const alreadyExistNotification = await models.Notification.findOne({
      where: { [Op.and]: [{ name: data.name }, { id: { [Op.ne]: id } }] },
    });
    if (alreadyExistNotification === null) {
      const [updated] = await models.Notification.update(data, {
        where: { id: id },
      });
      if (updated) {
        const updatedNotification = await models.Notification.findOne({ where: { id: id } });
        res.json(resultOk(updatedNotification.toJSON(), 'Notification is updated successfully'));
      }
    } else {
      res.json(resultError(null, `Notification already exists with name "${data.name}"`));
    }
  } else {
    res.json(resultError(null, `Notification does not exists with id "${id}"`));
  }
});

router.delete('/:id', async function(req, res) {
  const id = req.params.id;
  const deleted = await models.Notification.destroy({
    where: { id: id },
  });
  if (deleted) {
    res.json(resultOk(deleted, 'Notification is deleted successfully'));
  } else {
    res.json(resultError(`Notification not found with "${id}" id`));
  }
});

router.get('/', async function(req, res, next) {
  let notifications = null;
  try {
    notifications = await models.Notification.findAll({});
    return res.json(resultOk(notifications, 'List of notifications'));
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async function(req, res, next) {
  let notification = null;
  const id = req.params.id;
  try {
    notification = await models.Notification.findOne({ where: { id: id } });
    if (notification === null) {
      return res.json(resultError(`Notification not found with "${id}" id`));
    } else {
      return res.json(resultOk(notification, 'Founded notification'));
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
