const category = require('./category');
const media = require('./media');
const user = require('./user');
const area = require('./area');
const bookmark = require('./bookmark');
const merchant = require('./merchant');
const message = require('./message');
const notification = require('./notification');
const order = require('./order');
const rating = require('./rating');
const request = require('./request');
const service = require('./service');

const handleError = function(err, req, res) {
  if (err) {
    res.json({ status: 'error', data: null, error: err.message });
  }
};

const api = function(server) {
  server.use('/api/categories', category, handleError);
  server.use('/api/medias', media, handleError);
  server.use('/api/users', user, handleError);
  server.use('/api/areas', area, handleError);
  server.use('/api/bookmarks', bookmark, handleError);
  server.use('/api/merchants', merchant, handleError);
  server.use('/api/messages', message, handleError);
  server.use('/api/notifications', notification, handleError);
  server.use('/api/orders', order, handleError);
  server.use('/api/ratings', rating, handleError);
  server.use('/api/requests', request, handleError);
  server.use('/api/services', service, handleError);
};

module.exports = api;
