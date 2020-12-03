const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const models = require('../models');
const { resultOk, resultError } = require('../misc/common');

router.post('/', async function(req, res) {
  const data = req.body;
  const [service, created] = await models.Service.findOrCreate({
    where: { name: data.name },
  });
  if (created) {
    res.json(resultOk(service.toJSON(), 'Service is added successfully'));
  } else {
    res.json(resultError(null, `Service already exists with name "${data.name}"`));
  }
});

router.post('/:id', async function(req, res) {
  const data = req.body;
  const id = req.params.id;
  let service = await models.Service.findOne({ where: { id: id } });
  if (service !== null) {
    const alreadyExistService = await models.Service.findOne({
      where: { [Op.and]: [{ name: data.name }, { id: { [Op.ne]: id } }] },
    });
    if (alreadyExistService === null) {
      const [updated] = await models.Service.update(data, {
        where: { id: id },
      });
      if (updated) {
        const updatedService = await models.Service.findOne({ where: { id: id } });
        res.json(resultOk(updatedService.toJSON(), 'Service is updated successfully'));
      }
    } else {
      res.json(resultError(null, `Service already exists with name "${data.name}"`));
    }
  } else {
    res.json(resultError(null, `Service does not exists with id "${id}"`));
  }
});

router.delete('/:id', async function(req, res) {
  const id = req.params.id;
  const deleted = await models.Service.destroy({
    where: { id: id },
  });
  if (deleted) {
    res.json(resultOk(deleted, 'Service is deleted successfully'));
  } else {
    res.json(resultError(`Service not found with "${id}" id`));
  }
});

router.get('/', async function(req, res, next) {
  let services = null;
  try {
    services = await models.Service.findAll({});
    return res.json(resultOk(services, 'List of services'));
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async function(req, res, next) {
  let service = null;
  const id = req.params.id;
  try {
    service = await models.Service.findOne({ where: { id: id } });
    if (service === null) {
      return res.json(resultError(`Service not found with "${id}" id`));
    } else {
      return res.json(resultOk(service, 'Founded service'));
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
