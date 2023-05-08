const express = require('express');
const router = express.Router();
const axios = require('axios');
const database = require('../../database');

// Route middleware
router.get('/explore', (req, res) => {
    try {
        // API data
        let ep = `http://localhost:3000/genres`;

        // Then defines what happens after succesful call/request to api
        axios.get(ep).then((response) => {

            let sessionobj = req.session;
            if (sessionobj.authen) {
                let uid = sessionobj.authen;
                let user = `SELECT * FROM user WHERE user_id = ?`;
                database.query(user, [uid], (err, row) => {
                    let firstrow = row[0];
                    let genres = response.data;

                    res.render('search', { genres, userdata: firstrow, message : 'Please log in' });
                });
    

            } else {
                let genres = response.data;
                res.render('search', {genres, message : 'Please log in'});
            }
        });
    } catch (err) {
        console.log(err);
    }
});

// Route middleware
router.get('/search', (req, res) => {
    // Search query from the request query parameters
    const search = req.query.search;
    console.log('Search:', search); // For debugging
  
    if(search == ""){
        return res.redirect(`/explore`);
    }
    // Search based on the provided query
    res.redirect(`/results/${search}`);
  });

module.exports = router;