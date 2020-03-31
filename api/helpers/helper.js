const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const generateToken = userId => {
  const payload = {
    userId,
    iat: Math.floor(Date.now() / 1000) - 30,
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 60 * 24,
  };
  try {
    const token = jwt.sign(payload, process.env.SECRET);
    return token;
  } catch (err) {
    return false;
  }
};

const verifyJWT = token => {
  try {
    const legit = jwt.verify(token, process.env.SECRET);
    return legit;
  } catch (err) {
    return false;
  }
};

const comparePassword = async (password, enteredPassword) => {
  const valid = await bcrypt.compare(password, enteredPassword);
  if (valid) {
    return true;
  }
  return false;
};
module.exports = {
  verifyJWT,
  generateToken,
  comparePassword,
};
