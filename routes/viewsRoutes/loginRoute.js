const express = require('express');
const router = express.Router();
const database = require('../../database');
const bcrypt = require('bcrypt');

router.get('/login', (req, res) => {
        let sessionObj = req.session;
        if (sessionObj.authen) {
          res.render('alreadylogged');
        } 
        else {
            res.render('login');
        }
});

// Handling log in user
router.post('/login', (req, res) => {
  const user_name = req.body.usernameField;
  const password = req.body.passwordField;

  const checkUser = 'SELECT * FROM user WHERE user_name = ?';
  database.query(checkUser, [user_name], (err, rows) => {
    if (err) {
      throw err;
    }

    const numRows = rows.length;

    if (numRows > 0) {
      const user = rows[0];
      bcrypt.compare(password, user.user_password, (err, result) => {
        if (err) {
          throw err;
        }

        if (result) {
          req.session.authen = user.user_id;
          res.redirect('/dashboard');
        } else {
          res.render('login', { error: 'Incorrect username or password' });
        }
      });
    } else {
      res.render('login', { error: 'Incorrect username or password' });
    }
  });
});

// Route to logout
router.get('/logout', (req, res) => {
  res.clearCookie('sid');
  return res.redirect('/');
});


  
module.exports = router;