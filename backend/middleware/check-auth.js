const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  // if not contain tocken then it might fail
  try {
    const token =  req.header.authorization.split(" ")[1];
    jwt.verify(token, require('../uri').secrete);
    next();
  } catch(error) {
    res.status(401).json({ message: 'Tocken is not valid or not provided' });
  }
};
