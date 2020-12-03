const express = require('express');
const app = express();
var debug = require('debug')('express-sequelize');
var http = require('http');
const cors = require('cors');
var models = require('./models');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
var Api = require('./api/index');

var port = normalizePort(process.env.PORT || '8282');
app.use(express.static('public'));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: false, limit: '50mb' }));
app.use(bodyParser.json());

const corsOptions = {};
app.use(cors(corsOptions));
app.options('*', cors());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
Api(app);
app.set('port', port);
var server = http.createServer(app);
models.sequelize.sync().then(function() {
  server.listen(port, function() {
    console.log('Express server listening on port ' + server.address().port);
    debug('Express server listening on port ' + server.address().port);
  });
  server.on('error', onError);
  server.on('listening', onListening);
});

function normalizePort(val) {
  var port = parseInt(val, 10);
  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
}
function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }
  var bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}
function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
  debug('Listening on ' + bind);
}
