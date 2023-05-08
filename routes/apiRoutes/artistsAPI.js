const database = require('../../database');
const express = require('express');
const router = express.Router();

router.get('/artists', (req,res)=>{

    let getrows = `SELECT * FROM artist
                    ORDER BY artist_name ASC`;
    database.query(getrows,(err,artistrows)=>{
        if(err) throw err;
        res.json(artistrows);
    });

});

module.exports = router;