const database = require('../../database');
const express = require('express');
const router = express.Router();

router.get('/genres', (req,res)=>{

    let getrows = `SELECT * FROM genre
                    ORDER BY genre_name ASC`;
    database.query(getrows,(err,genrerows)=>{
        if(err) throw err;
        res.json(genrerows);
    });

});

module.exports = router;