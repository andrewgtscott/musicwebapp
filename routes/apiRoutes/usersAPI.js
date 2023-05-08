
const database = require('../../database');
const express = require('express');
const router = express.Router();

const bcrypt = require('bcrypt');
const session = require('express-session');
const axios = require('axios');
router.use(express.json());


router.post('/check-username', (req, res) => {
    const user_name = req.body.user_name;
    console.log('Username: ', user_name); // Debugging purposes
    const sql = `SELECT COUNT(*) AS count FROM user WHERE user_name = ?`;

    database.query(sql, [user_name], (err, results) => {
        if (err) throw error;

        console.log('Results:', results)
        const count = results[0].count;
        const usernameExists = count === 1;

        res.json({ usernameExists });
    });
});


router.post('/signup',  async (req, res) => {
    const { user_name, user_password, user_dob, user_email } = req.body;

    try {
        // Getting salt for bcrypt
        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);

        // Hashing the password using bcrypt
        const hashedPassword = await bcrypt.hash(user_password, salt);

        // Storing the hashed password and details in database
        const newUser = {
            user_name: user_name,
            user_password: hashedPassword,
            user_dob: user_dob,
            user_email: user_email
        };

        const q = `INSERT INTO user SET ?`;
        database.query(q, newUser, (err, result) => {
            if (err) {
                throw err;
            } else {
                res.redirect('/login');
            }
        });
    } catch (err) {
        res.redirect("/signup");
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});




router.get('/collections', (req, res) => {
  // SQL query to retrieve data from multiple tables for a specific genre
  const sql = `
    SELECT 
      user_collection.collection_title, 
      user_collection.collection_description, 
      user_collection.user_collection_id, 
      user.user_name AS collection_creator, 
      comments.comment,
      comments.rating,
      comment_user.user_name AS commenter
      FROM user_collection
      JOIN user ON user_collection.user_id = user.user_id
      LEFT JOIN comments ON user_collection.user_collection_id = comments.user_collection_id
      LEFT JOIN user AS comment_user ON comments.user_id = comment_user.user_id;

      SELECT usercollection_songs.user_collection_id, usercollection_songs.song_id, song.song_name
      FROM usercollection_songs
      JOIN song ON usercollection_songs.song_id = song.song_id
  `;

  // Query the database using the connection pool
  database.query(sql, (err, results) => {
    if (err) throw err;

    if (results.length === 0) {
      return res.send({ message: 'No results found' });
    }

    // Transform the data into JSON format
    const collections = {};
    results[0].forEach((row) => {
      // If collections doesnt have user_collection_id 
      if (!collections[row.user_collection_id]) {
        collections[row.user_collection_id] = {
          user_collection_id: row.user_collection_id,
          collection_title: row.collection_title,
          collection_description: row.collection_description,
          collection_creator: row.collection_creator,
          comments: [],
          songs: []  // Initialize the songs property as an empty array
        };
      }

      if (row.comment && row.commenter) {
        collections[row.user_collection_id].comments.push({
          comment: row.comment,
          commenter: row.commenter,
          rating: row.rating
        });
      }
    });

    results[1].forEach((row) => {
      // If collections does have user_collection_id
      if (collections[row.user_collection_id]) {
        collections[row.user_collection_id].songs.push({
          song_id: row.song_id,
          song_name: row.song_name
        });
      }
    });

    // Convert the collections object into an array
    const data = Object.values(collections);

    // Send the JSON response
    res.json(data);
  });
});



  
  


module.exports = router;