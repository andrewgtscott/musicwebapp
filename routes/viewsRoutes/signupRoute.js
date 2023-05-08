const express = require('express');
const router = express.Router();

router.get('/signup', (req, res) => {
        let sessionObj = req.session;
        if (sessionObj.authen) {    
          res.render('alreadylogged');
        } 
        else {
            res.render('signup');
        }
      });

module.exports = router;