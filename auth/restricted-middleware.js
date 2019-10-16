const jwt = require('jsonwebtoken');
const secrets = require('../config/secrets.js');

module.exports = (req, res, next) => {

  const token = req.headers.authorization; // client sends it here

  if(token) {
    // check that the token is valid
      // async needs a cb
    jwt.verify(token, secrets.jwtSecret, (err, decodedToken) => {
      if(err) {
        // foul play
        res.status(401).json({ message: 'Invalid Credentials!' });
      } else {
        // token is goooooood
        req.username = decodedToken.username;
        next();
      }
    })
    
  } else {
    res.status(400).json({ message: 'No credentials provided' });
  }
};
