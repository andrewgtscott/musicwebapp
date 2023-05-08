const db = require('../../database');
const express = require('express');
const router = express.Router();

// Route to retrieve data as JSON
router.get('/songs', (req, res) => {
    // SQL query to retrieve data from multiple tables
    const sql = `SELECT artist.artist_name, record_company.record_company_name, genre.genre_name, sub_genre_one.sub_genre_one_name, sub_genre_two.sub_genre_two_name, year.year, album.album_name, song.song_name, song.song_duration 
                 FROM song 
                 JOIN album ON album.album_id = song.album_id 
                 JOIN artist ON artist.artist_id = album.artist_id 
                 JOIN year ON year.year_id = album.year_id 
                 JOIN genre ON genre.genre_id = album.genre_id 
                 JOIN sub_genre_one ON sub_genre_one.sub_genre_one_id = album.sub_genre_one_id 
                 JOIN sub_genre_two ON sub_genre_two.sub_genre_two_id = album.sub_genre_two_id 
                 JOIN record_company ON record_company.record_company_id = artist.record_company_id`;

    // Query the database using the connection pool
    db.query(sql, (err, results) => {
        if (err) throw err;

        // Turning data into JSON format
        const data = results.map((row) => ({
            artist_name: row.artist_name,
            record_company_name: row.record_company_name,
            genre_name: row.genre_name,
            sub_genre_one_name: row.sub_genre_one_name,
            sub_genre_two_name: row.sub_genre_two_name,
            year: row.year,
            album_name: row.album_name,
            song_name: row.song_name,
            song_duration: row.song_duration
        }));

        // Send the JSON data as a response to the client
        res.json(data);
    });
});
router.get('/songs/:genreName', (req, res) => {
  // Get the genre name from the request parameters
  const genreName = req.params.genreName;

  // SQL query to retrieve data from multiple tables for a specific genre
  const sql = `SELECT artist.artist_name, album.album_description, record_company.record_company_name, genre.genre_name, genre.genre_description, sub_genre_one.sub_genre_one_name, sub_genre_two.sub_genre_two_name, year.year, album.album_name, song.song_name, song.song_duration 
               FROM song 
               JOIN album ON album.album_id = song.album_id 
               JOIN artist ON artist.artist_id = album.artist_id 
               JOIN year ON year.year_id = album.year_id 
               JOIN genre ON genre.genre_id = album.genre_id 
               JOIN sub_genre_one ON sub_genre_one.sub_genre_one_id = album.sub_genre_one_id 
               JOIN sub_genre_two ON sub_genre_two.sub_genre_two_id = album.sub_genre_two_id 
               JOIN record_company ON record_company.record_company_id = artist.record_company_id 
               WHERE genre.genre_name = ?`;

  // Query the database using the connection pool
  db.query(sql, [genreName], (err, results) => {
    if (err) throw err;

    // Turning data into JSON format
    const data = results.map((row) => ({
      artist_name: row.artist_name,
      record_company_name: row.record_company_name,
      genre_name: row.genre_name,
      genre_description:row.genre_description,
      sub_genre_one_name: row.sub_genre_one_name,
      sub_genre_two_name: row.sub_genre_two_name,
      year: row.year,
      album_name: row.album_name,
      album_description: row.album_description,
      song_name: row.song_name,
      song_duration: row.song_duration
    }));

    // Send the JSON data as a response to the client
    res.json(data);
  });
});

router.get('/songs/album/:albumName', (req, res) => {
  // Get the album from the request parameters
  const albumName = req.params.albumName;

  // SQL query to retrieve data from multiple tables for a specific genre
  const sql = `SELECT artist.artist_name, record_company.record_company_name,genre.genre_description, genre.genre_name, sub_genre_one.sub_genre_one_name, sub_genre_two.sub_genre_two_name, year.year, album.album_name, song.song_name, song.song_duration 
               FROM song 
               JOIN album ON album.album_id = song.album_id 
               JOIN artist ON artist.artist_id = album.artist_id 
               JOIN year ON year.year_id = album.year_id 
               JOIN genre ON genre.genre_id = album.genre_id 
               JOIN sub_genre_one ON sub_genre_one.sub_genre_one_id = album.sub_genre_one_id 
               JOIN sub_genre_two ON sub_genre_two.sub_genre_two_id = album.sub_genre_two_id 
               JOIN record_company ON record_company.record_company_id = artist.record_company_id 
               WHERE album.album_name = ?`;

  // Query the database using the connection pool
  db.query(sql, [albumName], (err, results) => {
    if (err) throw err;

    // Turning data into JSON format
    const data = results.map((row) => ({
      artist_name: row.artist_name,
      record_company_name: row.record_company_name,
      genre_name: row.genre_name,
      genre_description: row.genre_description,
      sub_genre_one_name: row.sub_genre_one_name,
      sub_genre_two_name: row.sub_genre_two_name,
      year: row.year,
      album_name: row.album_name,
      song_name: row.song_name,
      song_duration: row.song_duration
    }));

    // Send the JSON data as a response to the client
    res.json(data);
  });
});

router.get('/search/:search', (req, res) => {
  // Get the search request from the request parameters
  const search = req.params.search;
  console.log('Search:', search); // Add this line to log the search variable


  // SQL query to retrieve data from multiple tables for a specific genre
  const sql = `SELECT artist.artist_name, record_company.record_company_name, genre.genre_description, genre.genre_name, sub_genre_one.sub_genre_one_name, sub_genre_two.sub_genre_two_name, year.year, album.album_name, song.song_name, song.song_duration
  FROM song
  JOIN album ON album.album_id = song.album_id
  JOIN artist ON artist.artist_id = album.artist_id
  JOIN year ON year.year_id = album.year_id
  JOIN genre ON genre.genre_id = album.genre_id
  JOIN sub_genre_one ON sub_genre_one.sub_genre_one_id = album.sub_genre_one_id
  JOIN sub_genre_two ON sub_genre_two.sub_genre_two_id = album.sub_genre_two_id
  JOIN record_company ON record_company.record_company_id = artist.record_company_id
  WHERE album.album_name = ? OR song.song_name = ? OR artist.artist_name = ?
  
  `;

  // Query the database using the connection pool
  db.query(sql, [search, search, search], (err, results) => {
    if (err) throw err;

    if (results.length === 0) {
      return res.send( { message: 'No results found' });
    }

    // Turning data into JSON format
    const data = results.map((row) => ({
      artist_name: row.artist_name,
      record_company_name: row.record_company_name,
      genre_name: row.genre_name,
      genre_description: row.genre_description,
      sub_genre_one_name: row.sub_genre_one_name,
      sub_genre_two_name: row.sub_genre_two_name,
      year: row.year,
      album_name: row.album_name,
      song_name: row.song_name,
      song_duration: row.song_duration
    }));

    // Render the "results" page with the search results
    res.json(data);
  });
});


router.get('/collection/:collectionid', (req, res) => {
  // Get the collectionid from the request parameters
  const collectionid = req.params.collectionid;

  // SQL query to retrieve data from multiple tables for a specific genre
  const sql = `SELECT usercollection_songs.user_collection_id, user_collection.collection_title,
  artist.artist_name, 
  record_company.record_company_name, 
  genre.genre_name, 
  genre.genre_description, 
  sub_genre_one.sub_genre_one_name, 
  sub_genre_two.sub_genre_two_name, 
  year.year, 
  album.album_name, 
  song.song_name, 
  song.song_duration
FROM usercollection_songs
JOIN user_collection ON usercollection_songs.user_collection_id = user_collection.user_collection_id
JOIN song ON usercollection_songs.song_id = song.song_id
JOIN album ON album.album_id = song.album_id
JOIN artist ON artist.artist_id = album.artist_id
JOIN year ON year.year_id = album.year_id
JOIN genre ON genre.genre_id = album.genre_id
JOIN sub_genre_one ON sub_genre_one.sub_genre_one_id = album.sub_genre_one_id
JOIN sub_genre_two ON sub_genre_two.sub_genre_two_id = album.sub_genre_two_id
JOIN record_company ON record_company.record_company_id = artist.record_company_id
WHERE usercollection_songs.user_collection_id = ?
  ;`

  // Query the database using the connection pool
  db.query(sql, [collectionid], (err, results) => {
    if (err) throw err;

    // Turning data into JSON format
    const data = results.map((row) => ({
      user_collection_id: row.user_collection_id,
      collection_title: row.collection_title,
      artist_name: row.artist_name,
      record_company_name: row.record_company_name,
      genre_name: row.genre_name,
      genre_description: row.genre_description,
      sub_genre_one_name: row.sub_genre_one_name,
      sub_genre_two_name: row.sub_genre_two_name,
      year: row.year,
      album_name: row.album_name,
      song_name: row.song_name,
      song_duration: row.song_duration
    }));

    // Send the JSON data as a response to the client
    res.json(data);
  });
});


module.exports = router;