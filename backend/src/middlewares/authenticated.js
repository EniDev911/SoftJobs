'user strict'
const jwt = require('jsonwebtoken');
const config = require("../config");

exports.ensureAuth = async (req, res, next) => {
  const Authorization = req.header("Authorization");
  const token = Authorization.split("Bearer ")[1]
  if (!token) {
    throw res.status(401).json({
      auth: false,
      message: 'No token provided'
    })
  }
  jwt.verify(token, config.secret);
  try {
    const payload = jwt.decode(token, config.secret);
    req.user = payload;
    next();
  } catch (err) {
    return res.status(404).json({
      message: 'Token  is not valid'
    });
  }
}