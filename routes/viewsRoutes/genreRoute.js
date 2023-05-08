const axios = require('axios');
const express = require('express');
const router = express.Router();
const database = require('../../database');


router.get('/genres/:genreName', (req, res) => {
  const genreName = req.params.genreName;
  
  const url = `http://localhost:3000/songs/${genreName}`;

  axios.get(url)
    .then(response => {
      const data = response.data;

      let sessionObj = req.session;
      if (sessionObj.authen) {
        let uid = sessionObj.authen;
        let userQuery = `SELECT * FROM user WHERE user_id = ?`;
        database.query(userQuery, [uid], (err, row) => {
          if (err) {
            throw err
          } else {
            let firstRow = row[0];
            res.render('genre', { data: data, userdata: firstRow, message : 'Please log in' });
          }
        });
      } else {
        res.render('genre', { data: data, message : 'Please log in' });
      }
    })
    .catch(err => {
      throw err;
    });
});


module.exports = router;

