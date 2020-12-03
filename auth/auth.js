const role = require('./role');
const jwtToken = require('../misc/jwt_token');

module.exports = async function(req, res, next) {
  let token = req.headers['authorization'];
  if (token.startsWith('Bearer')) {
    // Remove Bearer from string
    token = token.slice(7, token.length);
  }
  if (!token) return res.status(401).send('Access Denied: No Token Provided!');
  try {
    const decoded = await jwtToken.verifyJWTToken(token);
    console.log('**************', decoded)
    if (
      // role[decoded.role].find(function(url) {
      //   return url == req.baseUrl;
      // })
      decoded
    ) {
      // eslint-disable-next-line require-atomic-updates
      req.user = decoded;
      next();
    } else
      return res
        .status(401)
        .send('Access Denied: You dont have correct privilege to perform this operation');
  } catch (ex) {
    res.status(401).send('Invalid Token');
  }
};
