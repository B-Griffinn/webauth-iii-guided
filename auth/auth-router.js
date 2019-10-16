const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Users = require('../users/users-model.js');
const secrets = require('../config/secrets.js'); // << bring in out secret config to replace hardcoded secret in token 

// for endpoints beginning with /api/auth
router.post('/register', (req, res) => {
  let user = req.body;
  const hash = bcrypt.hashSync(user.password, 10); // 2 ^ n
  user.password = hash;

  Users.add(user)
    .then(saved => {
      res.status(201).json(saved);
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

router.post('/login', (req, res) => {
  let { username, password } = req.body;

  Users.findBy({ username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(password, user.password)) {
        // Create JWT token
        const token = generateToken(user);
        // add token to response
        res.status(200).json({
          message: `Welcome ${user.username}!`,
          token,
        });
      } else {
        res.status(401).json({ message: 'Invalid Credentials' });
      }
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

// Function that gives us 
function generateToken(user) {
  // 1 Create payload
  const payload = {
    username: user.username, // 
    subject: user.id, // sub-claim on the token, same concept as HASHing
  };

  // 2 Create secret
  // const secret = 'is it secret?';

    //3 Create option(s)
  const options = {
    expiresIn: '1h', // adds a claim of the expiration date
  }

  // return all 3
  return jwt.sign(payload, secrets.jwtSecret, options)
}


module.exports = router;
