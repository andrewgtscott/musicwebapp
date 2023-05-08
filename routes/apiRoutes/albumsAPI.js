const database = require('../../database');
const express = require('express');
const router = express.Router();

// Route to retrieve data as JSON
router.get('/albums', (req, res) => {
    // SQL query to retrieve data from multiple tables
    const sql = `
    SELECT artist.artist_name, album.album_description, year.year, genre.genre_name, genre.genre_description, sub_genre_one.sub_genre_one_name, sub_genre_two.sub_genre_two_name, album.album_name, album.likes
    FROM album 
    JOIN artist ON artist.artist_id = album.artist_id
    JOIN year ON year.year_id = album.year_id
    JOIN genre ON genre.genre_id = album.genre_id
    JOIN sub_genre_one ON sub_genre_one.sub_genre_one_id = album.sub_genre_one_id
    JOIN sub_genre_two ON sub_genre_two.sub_genre_two_id = album.sub_genre_two_id

    
  `;

    // Query the database using the connection pool
    database.query(sql, (error, results) => {
        if (error) throw err;

        // Transform the data into JSON format
        const data = results.map((row) => ({
            artist_name: row.artist_name,
            genre_name: row.genre_name,
            genre_description: row.genre_description,
            sub_genre_one_name: row.sub_genre_one_name,
            sub_genre_two_name: row.sub_genre_two_name,
            year: row.year,
            album_name: row.album_name,
            album_description: row.album_description,
            rating: row.rating,
            likes: row.likes,


        }));

        // Send the JSON data as a response to the client
        res.json(data);
    });
});

module.exports = router;