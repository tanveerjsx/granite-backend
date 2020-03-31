const { verifyJWT } = require('../helpers/helper');

const authenticate = (req, res, next) => {
  let token = req.headers['authorization'];
  if (token) {
    if (token.startsWith('Bearer ')) {
      token = token.slice(7, token.length);
    }
  }
  if (!token) {
    return res.json({
      status: {
        success: false,
        message: 'Auth token is not supplied',
      },
    });
  }
  const legit = verifyJWT(token);
  if (!legit) {
    return res.json({
      status: {
        success: false,
        message: 'Authorization failed. You are not authorized for this request',
      },
    });
  }
  req.user = legit;
  next();
};
module.exports = authenticate;
