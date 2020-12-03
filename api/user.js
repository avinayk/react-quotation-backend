const express = require('express');
const router = express.Router();
const moment = require('moment');
const md5 = require('md5');
const { Op } = require('sequelize');
const models = require('../models');
const jwt = require('../misc/jwt_token');
const { resultError, resultOk } = require('../misc/common');
const auth = require('../auth/auth');

router.post('/', auth, async function(req, res, next) {
  const userData = req.body;
  let data = {
    firstName: userData.firstName,
    lastName: userData.lastName,
    email: userData.email,
    password: md5(userData.password),
    role: userData.roleName,
    roleId: userData.roleName,
    profileImageUrl: userData.profileImageUrl,
  };
  try {
    let user = await models.User.findOne({ where: { email: userData.email } });
    if (user === null) {
      const role = await models.Role.findOne({ where: { name: userData.roleName } });
      if (role !== null) {
        data.roleId = role.dataValues.id;
        user = await models.User.create(data);
        const result = {
          role,
          user,
        };
        res.json(resultOk({ result }, 'User Created Successfully'));
      } else {
        res.json(resultError(null, `Role not found with "${userData.roleName}" `));
      }
    } else {
      res.json(resultError(null, 'User Already Exist'));
    }
  } catch (error) {
    next(error);
  }
});

router.post('/sign-in', async function(req, res, next) {
  const userData = req.body;
  try {
    const email = userData.email;
    const password = md5(userData.password);
    const validUser = await models.User.findOne({ where: { email: email, password: password } });
    if (validUser !== null) {
      const role = await models.Role.findOne({ where: { id: validUser.roleId } });
      validUser.role = role.name;
      let token = jwt.genJWTToken(validUser);
      validUser.lastLoggedIn = moment()
        .utc()
        .unix();
      validUser.save();
      return res.json(resultOk(token, 'Login Successfully'));
    } else {
      return res.json(resultError(null, 'Invalid Email or Password'));
    }
  } catch (error) {
    next(error);
  }
});

router.post('/:id', auth, async function(req, res, next) {
  const data = req.body;
  const id = req.params.id;
  try {
    const user = await models.User.findOne({ where: { id: id } });
    if (user !== null) {
      const alreadyExistUser = await models.User.findOne({
        where: { [Op.and]: [{ email: data.email }, { id: { [Op.ne]: id } }] },
      });
      if (alreadyExistUser === null) {
        const role = await models.Role.findOne({ where: { name: data.roleName } });
        if (role !== null) {
          data.roleId = role.dataValues.id;
          data.password = md5(data.password);
          const [updated] = await models.User.update(data, {
            where: { id: id },
          });
          if (updated) {
            const updatedUser = await models.User.findOne({
              where: { id: id },
              include: {
                model: models.Role,
                as: 'role',
              },
            });
            res.json(resultOk(updatedUser.toJSON(), 'User is updated successfully'));
          }
        } else {
          res.json(resultError(null, `Role not found with "${data.roleName}" `));
        }
      } else {
        res.json(resultError(null, `User already exists with email "${data.email}"`));
      }
    } else {
      res.json(resultError(null, `User does not exists with id "${id}"`));
    }
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', auth, async function(req, res, next) {
  const id = req.params.id;
  let foundedUser = null;
  const user = req.user;
  try {
    foundedUser = await models.User.findOne({ where: { id: id } });
    if (foundedUser !== null) {
      if (user.role === 'superadmin') {
        models.User.destroy({
          where: { id: id },
        })
          .then(() => {
            res.json(resultOk(foundedUser.toJSON(), 'User is deleted successfully'));
          })
          .catch(err => {
            next(err);
          });
      } else {
        const updateUser = {
          status: 'DELETE',
          ...foundedUser,
        };
        models.User.update(updateUser, {
          where: { id: id },
        })
          .then(() => {
            res.json(resultOk(foundedUser, 'User is deleted successfully'));
          })
          .catch(err => {
            next(err);
          });
      }
    }
  } catch (error) {
    next(error);
  }
});

router.get('/search', auth, async function(req, res, next) {
  const searchText = req.query.searchText || '';
  const regex = new RegExp(searchText, 'i');
  let user = null;
  let userAggregates = [];
  if (searchText) {
    userAggregates.push({
      $match: {
        $or: [
          { firstName: { $regex: regex } },
          { lastName: { $regex: regex } },
          { email: { $regex: regex } },
        ],
      },
    });
  }
  userAggregates.push({
    $lookup: {
      from: 'roles',
      localField: 'roleId',
      foreignField: '_id',
      as: 'roleId',
    },
  });
  try {
    user = await models.User.aggregate(userAggregates);
    return res.json(resultOk(user, 'List of users'));
  } catch (error) {
    next(error);
  }
});

router.get('/', auth, async function(req, res, next) {
  let users = null;
  try {
    users = await models.User.findAll({
      include: {
        model: models.Role,
        as: 'role',
      },
    });
    return res.json(resultOk(users, 'List of available users'));
  } catch (error) {
    next(error);
  }
});

router.get('/:id', auth, async function(req, res, next) {
  let user = null;
  const id = req.params.id;
  try {
    user = await models.User.findOne({ where: { id: id } });
    if (user === null) {
      return res.json(resultError(`User not found with "${id}" id`));
    } else {
      return res.json(resultOk(user, 'Founded user'));
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
