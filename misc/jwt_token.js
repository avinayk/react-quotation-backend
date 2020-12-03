const jwt = require('jsonwebtoken');

class JwtToken {
  static genJWTToken(user) {
    let payload = {
      iss: 'Postadmin',
      sub: user.id,
      user_id: user.id,
      role: user.role,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      profileImageUrl: user.profileImageUrl,
    };
    let token = jwt.sign(payload, '--postadmin--', { expiresIn: '60 days' });
    return token;
  }

  static verifyJWTToken(token) {
    return new Promise((resolve, reject) => {
      jwt.verify(token, '--postadmin--', (err, decodedToken) => {
        if (err || !decodedToken) {
          return reject(err);
        }
        resolve(decodedToken);
      });
    });
  }
  static genJWTgenSubscriberJWTTokenToken(user) {
    let payload = {
      iss: 'BlogPost',
      sub: user.id,
      user_id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    };
    let token = jwt.sign(payload, '--blogpost--', { expiresIn: '60 days' });
    return token;
  }
}

module.exports = JwtToken;
