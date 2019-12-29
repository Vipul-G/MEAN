const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  // if not contain tocken then it might fail
  try {
    const token =  req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, require('../uri').secrete);
    req.userData = { email: decodedToken.email, userId: decodedToken.userId };
    next();
  } catch(error) {
    res.status(401).json({ message: 'Tocken is not valid or not provided' });
  }
};
